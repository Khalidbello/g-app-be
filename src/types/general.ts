interface vAccountType {
    account_number: string;
    account_name: string;
    bank_name: string;
    balance: number;
}

interface checkUserExistType {
    password: string;
    first_name: string;
    last_name: string;
    gender: string;
    id: number
}
export type {
    vAccountType,
    checkUserExistType
}