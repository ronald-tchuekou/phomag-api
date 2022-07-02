const request = require('request')
const moment = require('moment')
const UserModel = require('./api/models/user.model')
const bcrypt = require('bcrypt')

class Personal {
   MATRICULE = ''
   FIRSTNAME = ''
   LASTNAME = ''
   GENDER = ''
   EMAIL = ''
   ACTIVED = false
   NUMPHONE = ''
   NUMPHONE2 = ''
   LASTJOB = ''
}

/**
 * Function to check if personal is Teacher or not.
 * @param item
 * @returns {boolean}
 */
const isTeacher = (item) => {
   const job = (item.LASTJOB || '').toLowerCase().trim()
   return job.includes('enseignant') ||
      job.includes('enseignante') ||
      job.includes('teacher') ||
      job.includes('teaching')
}

/**
 * Functoin to check if personal is Chief of department or not.
 * @param item
 * @returns {boolean}
 */
const isManager = (item) => {
   const job = (item.LASTJOB || '').toLowerCase().trim()
   return job.includes('chef de departement') ||
      job.includes('chef du departement') ||
      job.includes('chef de département') ||
      job.includes('chef du département')
}

const getPersonnels = () => {
   const options = {
      'method': 'GET',
      'url': 'https://galioserver.myiuc.com/employees?apiGKey=$iL@0n!Y@1aQuE@2dE@3GrAnDe@4PaSsIoN@5pOuR@6eNfAnTeR@7dE@8gRaNdS@9hOmMeS$',
      'headers': {}
   }
   request(options, async function(error, response) {
      if (error) {
         console.log(error)
         return
      }
      const data = JSON.parse(response.body)
      const result = data.filter(
         /**
          * @param {Personal} item
          * @returns {false|*}
          */
         item => (isTeacher(item) || isManager(item)) && item.ACTIVED)
         .map(
            /**
             * @param {Personal} item
             * @returns any
             */
            item => ({
               matricule: item.MATRICULE,
               firstname: item.FIRSTNAME,
               lastname: item.LASTNAME,
               sex: item.GENDER,
               email: item.EMAIL,
               phone: item.NUMPHONE || item.NUMPHONE2,
               fonction: item.LASTJOB,
               password: bcrypt.hashSync('password', 8),
               image_profile: 'default_profile.png',
               role: isTeacher(item) ? 'Teacher' : 'Chief',
               created_token: bcrypt.hashSync('created_token', 5)
            }))
      try {
         await UserModel.createUser(result)
         console.log('All users is set !')
      } catch (e) {
         console.log(e)
      }
      console.log(moment().format('DD-MM-YYYY at HH:mm:ss'))
      setTimeout(() => getPersonnels(), 1000 * 60 * 60 * 24)
   })
}

exports.getPersonnels = getPersonnels
