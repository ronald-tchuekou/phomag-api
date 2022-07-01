const request = require('request');
const moment = require("moment");

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
      'headers': {
      }
   };
   request(options, function (error, response) {
      if (error) {
         console.log(error)
         return
      }
      const data = JSON.parse(response.body);
      const result = data.filter(item => isTeacher(item) || isManager(item))
         .map(item => ({
            matricule: item.MATRICULE,
            activated: item.ACTIVED,
            firstname: item.FIRSTNAME,
            lastname: item.LASTNAME,
            sex: item.GENDER,
            email: item.EMAIL,
            phone: item.NUMPHONE,
            phone2: item.NUMPHONE2,
            fonction: item.LASTJOB,
            role: isTeacher(item) ? 'Teacher' : 'Manager'
         }))
      console.log(result)
      console.log(moment().format('DD-MM-YYYY at HH:mm:ss'))
      setTimeout(() => getPersonnels(), 1000 * 60 * 60 * 24 )
   });
}


exports.getPersonnels = getPersonnels
