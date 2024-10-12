const crypto = require('crypto')
const { categories } = require('../../config.json')


exports.createPassword = (password = 'archer_admin') => {
    let salt = crypto.randomBytes(16).toString('hex');
    let hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return { salt, hash }
}


exports.verifyPassword = (password, oldHash, salt) => {
    let newHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return newHash === oldHash
}


exports.categoryInsert = async () => {
    try {
        const { Category } = global.sequelize;

        let check = await Category.findAll({ where: {} });
        if (!check.length) {
            let data = await Category.bulkCreate([...categories.map(data => ({ name: data }))]);

            data.length ? console.log('Categories inserted') : console.error('Categories not inserted');
        }

    } catch (error) {
        console.log('Error', error)
    }
}

exports.expireSeconds = () => {
    const currentDate = new Date();

    const futureDate = new Date().setDate(currentDate.getDate() + 7);

    // Calculate the difference in milliseconds between the two dates
    const timeDifferenceMillis = futureDate - currentDate;

    // Convert milliseconds to seconds
    const timeDifferenceSeconds = timeDifferenceMillis / 1000;

    return timeDifferenceSeconds;
}
