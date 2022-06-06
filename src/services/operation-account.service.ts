import OperationAccountRepository from "../repositories/operation-account-repository";
import { ILoggedUser } from "../types/auth";
import { IMetaTrader, 
    IOperationAccount, 
    IOperationAccountCreateRepository, 
    IOperationAccountCreateRequest, 
    OPERATION_ACCOUNT_FILTER 
} from "../types/operation-account";
import { convertToEnum } from "../helpers/general";
import { LEVERAGE, OPERATION_TYPE, SPREAD_TYPE } from "@prisma/client";
import ValidationError from "../errors/validation-error";
import UserRoleRepository from "../repositories/user-role-repository";
import MT5Service from "./metatrader/mt5-service";
import { IMt5OperationAccountCreate, IMt5User, IMt5UserCreate } from "../types/mt5";
import generatePassword from "../helpers/generate-password";
import UserService from "./user.service";
import UserRepository from "../repositories/user-repository";
import APIError from "../errors/api-error";

class OperationAccountService {
    private operationAccountRepository: OperationAccountRepository;
    private userRoleRepository: UserRoleRepository;
    private mt5Service: MT5Service;

    constructor(operationAccountRepository: OperationAccountRepository) {
        this.operationAccountRepository = operationAccountRepository;
        this.userRoleRepository = new UserRoleRepository();
        this.mt5Service = new MT5Service();
    }

    public async create(user: ILoggedUser, operation_account: IOperationAccountCreateRequest): Promise<IOperationAccount> {
        let config: IMetaTrader | null;
        let balance: number;

        if (operation_account.operation_type === "METATRADER") {
            const metatrader: IMetaTrader = {
                spread_type: operation_account.config.spread_type,
                leverage: operation_account.config.leverage
            };
            config = metatrader;
        }

        if (!operation_account.is_demo || !operation_account.balance) {
            balance = 0.0;
        } else {
            balance = operation_account.balance;
        }

        let new_operation_account: IOperationAccountCreateRepository;
        const main_password = generatePassword();
        const investor_password = generatePassword();

        if (config) {
            new_operation_account = {
                name: operation_account.name,
                is_demo: operation_account.is_demo,
                operation_type: convertToEnum<OPERATION_TYPE>(operation_account.operation_type, OPERATION_TYPE),
                leverage: convertToEnum<LEVERAGE>(config.leverage, LEVERAGE),
                spread_type: convertToEnum<SPREAD_TYPE>(config.spread_type, SPREAD_TYPE),
                balance,
                main_password,
                investor_password
            }
        } else {
            new_operation_account = {
                name: operation_account.name,
                is_demo: operation_account.is_demo,
                operation_type: convertToEnum<OPERATION_TYPE>(operation_account.operation_type, OPERATION_TYPE),
                balance,
                main_password,
                investor_password
            }
        }

        const group = this.getMetatraderGroup(new_operation_account);

        new_operation_account.metatrader_group = group;

        const userRepository = new UserRepository();
        const find_user = await userRepository.find(user.user_id);
/*
        const mt5_operation_account: IMt5OperationAccountCreate = {
            passMain: main_password,
            passInvestor: investor_password,
            group: "real\\real",
            name: new_operation_account.name,
            leverage: this.getLeverageNumberValueFromEnum(new_operation_account.leverage),
            mt5Id: await this.getOrCreateMetatraderClientId(user.user_role_id, find_user.first_name, find_user.last_name)
        };

        const mt5_ret = await this.mt5Service.createOperationAccount(mt5_operation_account);

        new_operation_account.account_number = Number(mt5_ret.login);
*/
        const ret = await this.operationAccountRepository.create(user, new_operation_account);

        return ret;
    }

    public async listReals(user_role_id: string): Promise<IOperationAccount[]> {
        const ret = await this.operationAccountRepository.listReals(user_role_id);
       
        return ret;
    }

    public async listDemos(user_role_id: string): Promise<IOperationAccount[]> {
        const ret = await this.operationAccountRepository.listDemos(user_role_id);
       
        return ret;
    }

    public async update(user_role_id: string, account_number: string, operation_account) {
        //TODO
    }

    public async rescue(user_role_id: string, account_number: string) {
        const auth_token = process.env.MT5_AUTH_TOKEN;

        const mt5_body = {
            account_number,
            auth_token
        }

        //const ret = await MT5Api.post("/api/v1/withdraw", mt5_body);
    }

    private async syncOperationsAccount(
        operations_account_mt5: any[], 
        operations_account_select: IOperationAccount[]
    ): Promise<IOperationAccount[]> {

        for (let i=0; i < operations_account_mt5.length; i++) {
            
            const mt5_account = operations_account_mt5[i];
            
            for (let j=0; j < operations_account_select.length; j++) {
                
                const select_account = operations_account_select[j];
                
                if (mt5_account.account_number === select_account.account_number) {
                    
                    const updated_select_account = await this.operationAccountRepository.updateBalance(
                        select_account.id, 
                        mt5_account.balance
                    );
                    
                    operations_account_select[j] = updated_select_account;
                    
                    break;
                }

            }

        }

        return operations_account_select;
    }

    private getMetatraderGroup(operation_account: IOperationAccountCreateRepository): string {
        if (operation_account.operation_type === "METATRADER") {
            return operation_account.is_demo ? `demo\\forex.hedged` : `real\\real.hedge`;
        } else if (operation_account.operation_type === "BOTMONEY") {
            return operation_account.is_demo ? "demobotmoney" : "botmoney";
        } else {
            throw new ValidationError("operation_account.invalid_group");
        }
    }

    public async listByToken(token_integration: string, account_type: string, filter_str: string) {
        const user_role = await this.userRoleRepository.findByIntegrationToken(token_integration);

        if (!user_role) {
            throw new ValidationError("botmoney.invalid_integration_token");
        }

        let just_demo_account;

        if (account_type === "REAL") {
            just_demo_account = false;
        } else {
            just_demo_account = true;
        }

        let filter: OPERATION_ACCOUNT_FILTER;
        
        if (filter_str) {
            filter = convertToEnum<OPERATION_ACCOUNT_FILTER>(filter_str, OPERATION_ACCOUNT_FILTER, "operation_account.invalid_account_filter");
        } else {
            filter = OPERATION_ACCOUNT_FILTER.ALL;
        }

        const operations_account = await this.operationAccountRepository.listBotmoneyAccountsByUser(user_role.id, just_demo_account, filter);

        return operations_account;
    }

    private async getOrCreateMetatraderClientId(user_role_id: string, first_name: string, last_name: string): Promise<number> {
        console.log("get or meta client id");
        const user_role = await this.userRoleRepository.find(user_role_id);
        
        if (user_role.metatrader_client_id) {
            console.log("alteray registered client: ", user_role.metatrader_client_id);
            return user_role.metatrader_client_id;
        }
        console.log("creating client mt5");
        const mt_new_user: IMt5UserCreate = {
            externalId: user_role.id, // id da select
            name: first_name, // nome do titular @unique
            lastName: last_name, // ultimo nome do titular
            type: 1, // [1] type do user. pode ser user (type=1), ou manager (type=2)
            status: 700, // [700] - status de que a conta pode começar a operar (documentos validados)
            assignedManager: 1173 // [1173] - conta manager com web api habilitada
        }

        let success = false;
        let cont = 0;
        let mt5_user: IMt5User;
        while (!success && cont < 5) {
            try {
                console.log("tentativa client ", cont);
                mt5_user = await this.mt5Service.createUser(mt_new_user);
                success = true;
                break;
            } catch (e) {
                console.log("erro mt5");
            }
            cont++;
        }
        
        if (!success) {
            throw new APIError("erro mt5");
        }
        console.log("sucess create account");

        console.log("create new client account: ", mt5_user.id);
        return Number(mt5_user.id);
    }

    private getLeverageNumberValueFromEnum(leverage: LEVERAGE): number {
        if (leverage === LEVERAGE.ONE_TO_100) {
            return 100;
        } else if (leverage === LEVERAGE.ONE_TO_300) {
            return 300;
        } else if (leverage === LEVERAGE.ONE_TO_1000) {
            return 1000;
        } else {
            throw new ValidationError();
        }
    }

}

export default OperationAccountService;