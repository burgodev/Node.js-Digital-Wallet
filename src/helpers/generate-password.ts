export default function generatePassword(length:number=8): string {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    const n = charset.length
    for (let i = 0; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password.toString();
}
