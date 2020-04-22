let DiscordErrors = {
	INVALID_TOKEN: "Discord API Error: An INVALID discord login token has been provided",
	NO_TOKEN: "Discord API Error: Discord login token must not be null!",
	CHANNEL_UNDEFINED: "Discord API Error: Channel Not Found"
}

let httpErrors = {
	UNAUTHORIZED: "401 Unauthorized: Not logged in or Token Invalid",
	NOT_FOUND: "404 Not Found"
}

let TypeErrors = {
	STRING: 'Input must be type of string!',
	FUNCTION: 'Input must be type of function!',
	BOOLEAN: 'Input must be type of boolean!',
	NUMBER: 'Input must be type of number!'
}


function KeyMissingError(key){
	throw new Error(`Required Value ${key} is not defined`)
}


module.exports = {
	DiscordAPI: DiscordErrors,
	TypeErrors: TypeErrors,
	KeyMissingError: KeyMissingError,
	httpErrors: httpErrors
}

