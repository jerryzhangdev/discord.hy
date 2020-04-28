let Errors = {
	//undefined errors
	INVALID_TOKEN: "Discord API Error: An INVALID discord login token has been provided",
	NO_TOKEN: "Discord API Error: Discord login token must not be null!",
	CHANNEL_UNDEFINED: "Discord API Error: Channel Not Found",
	UNKNOWN_GUILD: "Discord API Error: Unknown Guild",
	UNKNOWN_CHANNEL: "Discord API Error: Unknown Channel",
	UNKNOWN_STATUSCODE: 'Unknown Status Code was provided',

	//httperrors
	UNAUTHORIZED: "401 Unauthorized: Not logged in or Token Invalid",
	NOT_FOUND: "404 Not Found",

	//type errors
	STRING: 'Input must be type of string!',
	FUNCTION: 'Input must be type of function!',
	BOOLEAN: 'Input must be type of boolean!',
	NUMBER: 'Input must be type of number!'
}


function KeyMissingError(key){
	throw new Error(`Required Value ${key} is not defined`)
}


module.exports = {
	Errors: Errors,
	KeyMissingError: KeyMissingError
}

