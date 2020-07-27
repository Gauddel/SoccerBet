const { Requester, Validator } = require('@chainlink/external-adapter')
require('dotenv').config()

const customError = (data) => {
  if (data.Response === 'Error') return true
  return false
}

const customParams = {
  matche: ['matche'],
}

const createRequest = (input, callback) => {
  const validator = new Validator(callback, input, customParams);
  const jobRunID = validator.validated.id
  const matcheId = validator.validated.data.matche;
  const url = `https://api.football-data.org/v2/matches/${matcheId}`


  const params = {
  }

  const config = {
    url,
    params
  }

  console.error(process.env.API_KEY, "API_KEY")
  console.error(matcheId, 'Matches ID')
  if (process.env.API_KEY) {
    config.headers = {
      'X-Auth-Token': `${process.env.API_KEY}`
    }
  }

  Requester.request(config, customError)
    .then(response => {

      callback(response.status, Requester.success(jobRunID, response))
    })
    .catch(error => {
      callback(500, Requester.errored(jobRunID, error))
    })
}

module.exports.createRequest = createRequest