import MT5Api from "../../helpers/mt5-api";
import { IMt5OperationAccount, IMt5OperationAccountCreate, IMt5User, IMt5UserCreate } from "../../types/mt5";

class MT5Service { //acrescentar validações nos métodos

    //private api: AxiosInstance;
    private api;

    constructor() {
        this.api = MT5Api;
    }

    public async createUser(new_user: IMt5UserCreate): Promise<IMt5User> {
        const ret = await this.api.post("/users", new_user);
        
        return ret;
    }

    public async listUsers(): Promise<IMt5User[]> {
        const { data } = await this.api.get("/users");
        
        return data;
    }

    public async createOperationAccount(new_operation_account: IMt5OperationAccountCreate): Promise<IMt5OperationAccount> {
        const { data } = await this.api.post("/operation-accounts", new_operation_account);

        return data;
    }

    public async getOperationAccountByLogin(login: number) { //login - operation account
        //verificar retorno
    }

    public async listOperationAccounts(): Promise<IMt5OperationAccount[]> {
        const ret = await this.api.get("/operation-accounts");

        return ret;
    }

    public async updateOperationAccountBalance(account_number: number, increment_balance: number) { //check
        const ret = await this.api.patch(`/operation-accounts/balance/${account_number}`, 
            { balance: increment_balance }
        );

        return ret;
    }

    public async updateOperationAccountPassword(type: string, new_password: string, account_number: number) {
        const ret = await this.api.get(`/password/${account_number}`, 
        {
            type,
            password: new_password
        });

        return ret;
    }

}

export default MT5Service;