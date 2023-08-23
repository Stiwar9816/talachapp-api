export const randomPassword = () => {
    const letters = '0123456789ABCDEFGHIJKLMNÑOPQRSTUVXYZabcdefghijklmnñopqrtuvwxyz*-/!#$%&_+¡'
    let password = ''

    for (let i = 0; i < 20; i++) {
        password += letters[Math.floor(Math.random() * 73)]
    }
    return password
}