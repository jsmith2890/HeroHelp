'use strict'

const db = require('../server/db')
const {Category, Order, Product, Review, User} = require('../server/db/models')
const users = require('./data/user.json')
const orders = require('./data/order.json')
const reviews = require('./data/review.json')
const categoryIcons = require('./larpData/category-icons.json')
const fs = require('fs')
const path = require('path')

/**
 * Welcome to the seed file!
 */

// Reads a directory of json files and creates an array of objects:
// [{ name: <filename>, data: <json data>}, ...]
const loadFiles = dir => {
  console.log('LOADING FILES')
  const allInputFiles = []
  let totalProducts = 0
  fs.readdirSync(path.join(__dirname, dir)).forEach(file => {
    const name = file.replace('.json', '')
    const data = require('./' + path.join(dir, file))
    console.log('file:', file, 'numRecords:', data.length)
    totalProducts += data.length
    allInputFiles.push({name, data})
  })
  console.log('TOTAL PRODUCTS:', totalProducts)
  return allInputFiles
}

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  // Seed Users
  await User.bulkCreate(users)
  console.log(`seeded ${users.length} users`)

  const inputFiles = loadFiles('./larpData/epicarmoury')

  // For each json file, create the product(s) and category(s)
  for (let i = 0; i < inputFiles.length; i++) {
    const file = inputFiles[i]
    // For each product, create the product and category associations
    for (let j = 0; j < file.data.length; j++) {
      const product = file.data[j]

      // Create products
      const productObj = {
        name: product.name,
        numInStock: 3,
        price: product.price,
        description: product.description,
        imageUrl: 'img/' + product.localImgName
      }
      const createdProduct = await Product.create(productObj, {returning: true})
      console.log('createdProduct.id:', createdProduct.id)

      // Find or create categories
      const categories = product.categories
      for (let k = 0; k < categories.length; k++) {
        const thisCategoryName = categories[k]
        const categoryToCreate = {name: thisCategoryName }
        // Set the imageUrl of the category if specified
        // console.log('thisCategoryName:', thisCategoryName, 'categoryIcons[thisCategoryName]:', categoryIcons[thisCategoryName])
        if (categoryIcons[thisCategoryName]) {
          categoryToCreate.imageUrl = categoryIcons[thisCategoryName]
        }
        // console.log('created:', createdCat)
        const [category, created] = await Category.findOrCreate({
          where: {name: thisCategoryName},
          defaults: categoryToCreate
        })
        if (created) {
          console.log('Category created:', categoryToCreate)
        }
        // Create the product-category association
        await createdProduct.addCategory(category.id)
      }
    }
  }

  // Set the images on the categories
  // categoryIcons.forEach(())

  // Seed the Orders
  await Order.bulkCreate(orders)
  console.log(`seeded ${orders.length} orders`)

  // Seed the Reviews
  await Review.bulkCreate(reviews)
  console.log(`seeded ${reviews.length} reviews`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
