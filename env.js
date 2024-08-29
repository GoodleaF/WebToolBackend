'use strict'

const dotenv = require('dotenv')
const path = require('path')

dotenv.config();

console.log('NODE_ENV1 = ', process.env.NODE_ENV)
const environment = process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase()
process.env.NODE_ENV =  environment === 'production' ? 'production' : 
                        environment === 'qa' ? 'qa' : 'development';
console.log('NODE_ENV2 = ', process.env.NODE_ENV)