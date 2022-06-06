const t_schema = {
    auth: {
        not_authenticated: "auth.not_authenticated",
        login: { success: "auth.login.success", registered: "auth.login.registered" },
        credentials: { invalid: "auth.credentials.invalid" },
        pessword_recovery: {
            title: "auth.pessword_recovery.title",
            bt: "auth.pessword_recovery.bt",
            already_requested: "auth.pessword_recovery.already_requested",
            requested: "auth.pessword_recovery.requested",
            changed: "auth.pessword_recovery.changed",
        },
        email_confirmation: { title: "auth.email_confirmation.title", bt: "auth.email_confirmation.bt" },
        password_generation: { title: "auth.password_generation.title", body: "auth.password_generation.body" },
        validations: { 
            passwords_differs: "auth.validations.passwords_differs",
            lack_acceptance_terms:"auth.validations.lack_acceptance_terms" 
        },
    },
    user: {
        not_found: "user.not_found",
        already_exists: "user.already_exists",
        list: "user.list",
        created: "user.created",
        updated: "user.updated",
        role: {
            not_found: "user.role.not_found",
            already_exist: "user.role.already_exist",
            password_invalid: "user.role.password_invalid",
        },
        documents: { not_uploaded: "user.documents.not_uploaded" },
        profile: {
            updated: "user.profile.updated",
            change_password: {
                invalid: "user.profile.change_password.invalid",
                changed: "user.profile.change_password.changed",
            },
            documents: { uploaded: "user.profile.documents.uploaded" },
        },
    },
    role: { not_found: "role.not_found" },
    manager: { not_created: "manager.not_created", created: "manager.created" },
    document: { not_found: "document.not_found", approved: "document.approved", reproved: "document.reproved" },
    token: { invalid: "token.invalid" },
    error: { password_generation: "error.password_generation" },
    email: {
        send: { error: "email.send.error" },
        check: { send_error: "email.check.send_error" },
        validated: "email.validated",
    },
    notification: { list: "notification.list", unreaded: "notification.unreaded", readed: "notification.readed" },
    country: { list: "country.list" },
    device: { error: { invalid_device_type: "device.error.invalid_device_type" } },
    transaction: {
        options: "transaction.options",
        type: { not_found: "transaction.type.not_found" },
        request: { complete: "transaction.request.complete", cancel: "transaction.request.cancel" },
        application: {
            created: "transaction.application.created",
            error: "transaction.application.error",
            operation_account: { is_demo: "transaction.application.operation_account.is_demo" },
        },
        rescue: { created: "transaction.rescue.created", error: "transaction.rescue.error" },
        deposit: { created: "transaction.deposit.created" },
    },
    wallet: {
        name: "wallet.name",
        not_found: "wallet.not_found",
        balance: { insufficient: "wallet.balance.insufficient" },
    },
    ax: {
        error: { unautenticated: "ax.error.unautenticated", wallet: "ax.error.wallet" },
        wallet: {
            created: "ax.wallet.created",
            not_found: "ax.wallet.not_found",
            address_not_found: "ax.wallet.address_not_found",
            address: "ax.wallet.address",
        },
        deposit: { amount_invalid: "ax.deposit.amount_invalid", already_exists: "ax.deposit.already_exists" },
    },
    operation_account: {
        not_found: "operation_account.not_found",
        invalid_group: "operation_account.invalid_group",
        invalid_operation_account_type: "operation_account.invalid_operation_account_type",
        balance: { insufficient: "operation_account.balance.insufficient" },
    },
    botmoney: { invalid_integration_token: "botmoney.invalid_integration_token" },
    enum: { not_found: "enum.not_found" },
};
export default t_schema;
