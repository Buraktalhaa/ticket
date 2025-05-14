export type Signup = {
    email:string,
    firstName:string,
    password:string,
} 

export type Signin = {
    email:string,
    password:string,
} 

export type Email = {
    email:string
}

export type Passwords = {
    password:string,
    confirmPassword:string,
    token:string | null;
}