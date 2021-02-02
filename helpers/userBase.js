const bcrypt = require('bcryptjs')

exports.login = async (inputUsername, inputPassword) => {
    let passwordOne = await bcrypt.hash('pass',10)
    let passwordTwo = await bcrypt.hash('mypass',10)
    
    const users = [
        {id: 1, username: 'Tester', password: passwordOne},
        {id: 2, username: 'Boss', password: passwordTwo},
    ]
    
    let user = users.find(({username}) => username == inputUsername)

    if (!user) throw new Error('User not found')

    let passwordCheck = await bcrypt.compare(inputPassword,user.password)

    if (!passwordCheck) throw new Error('Incorrect password')

    return user.id
}