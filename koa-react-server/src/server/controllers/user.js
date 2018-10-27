async function getUserInfo(ctx) {
    ctx.body = {
        name: 'Chikara Chan',
        gender: 'male',
        age: 20,
        UserId: 1
    }
}

export default { getUserInfo }