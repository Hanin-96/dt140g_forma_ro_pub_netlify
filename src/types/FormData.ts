export interface FormData {
    name: string;
    email: string;
    message: string;
    phone: string;
    checkbox: boolean;
}

export interface FormErrors {
    name?: string;
    email?: string;
    message?: string;
    phone?: string;
    amount?: string;
    checkboxMsg?: string;

}

export interface OrderFormData {
    name: string;
    email: string;
    message: string;
    amount: number;
    phone: string;
    checkbox: boolean;
}


