const https = require('https');
require('dotenv').config();

class SoccerApi {

    static getCompetitionId = (callback) => {

        var options = {
            host: 'api.football-data.org',
            path: `/v2/competitions/`,
            method: 'GET',
            
            headers: {
                // mode: 'no-cors',
                'X-Auth-Token': process.env.REACT_APP_API_KEY
            }
        }

        SoccerApi.get(options, callback);
    }

    static getTeams = (competitionId, callback) => {

        var options = {
            host: 'api.football-data.org',
            path: `/v2/competitions/${competitionId}/teams`,
            method: 'GET',
            headers: {
                'X-Auth-Token': process.env.REACT_APP_API_KEY
            }
        }

        SoccerApi.get(options, callback);
    }

    static getMatches = (teamId, callback) => {
        var options = {
            host: 'api.football-data.org',
            path: `/v2/teams/${teamId}/matches/`,
            method: 'GET',
            headers: {
                'X-Auth-Token': process.env.REACT_APP_API_KEY
            }
        }

        SoccerApi.get(options, callback);
    }

    static getSpecificMatche = (matcheId, callback) => {
        var options = {
            host: 'api.football-data.org',
            path: `/v2/matches/${matcheId}`,
            method: 'GET',
            headers: {
                'X-Auth-Token': process.env.REACT_APP_API_KEY
            }
        }

        SoccerApi.get(options, callback);
    }

    static get = (options, callback) => {
        https.get(options, (res) => {
            var body = '';

            res.on('data', (data => {
                body += data;
            }))

            res.on('end', () => {
                var resultat = JSON.parse(body);
                callback(resultat);
            })
        })
    }
}

export default SoccerApi;