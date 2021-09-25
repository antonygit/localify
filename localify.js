const
{
	google
} = require('googleapis');
const fs = require('fs')
let res = [];
var fres = [];
let finalObj = {};

// DFS get leaf node and get data
let getKey = (obj, parent, finalObj) =>
{
	for (let key in obj)
	{
		if (typeof obj[key] === "object")
		{
			getKey(obj[key], parent + "_" + key, finalObj);
		}
		else
		{
			res.push(obj[key]);
		}
	}
}

// DFS get leaf node and update data

let putKey = (obj, parent, finalObj) =>
{
	for (let key in obj)
	{
		if (typeof obj[key] === "object")
		{
			putKey(obj[key], parent + "_" + key, finalObj);
		}
		else
		{
			obj[key] = fres.shift();

		}
	}
}

const asyncCallTranslate = async (client, res, language, spreadsheetId, dataFeed) =>
{
	for (var i = 0; i < language.length; i++)
	{
		console.log(language[i])
		await translate(client, res, language[i], spreadsheetId, dataFeed);
	}
}

const localify = (client_email, private_key, spreadsheetId, language, dataFeed) =>
{

	const client = new google.auth.JWT(
		client_email, null, private_key, ['https://www.googleapis.com/auth/spreadsheets']
	);
	client.authorize(async function (err, token)
	{
		if (err)
		{
			console.log(err);
			return;
		}
		else
		{
			getKey(dataFeed, "dataFeed", finalObj);
			console.log('connected');
			if (language instanceof Array)
			{

				asyncCallTranslate(client, res, language, spreadsheetId, dataFeed);

			}
			else
			{
				console.log(language)
				await translate(client, res, language, spreadsheetId, dataFeed);

			}







		}

	});


}


async function translate(cl, string, lan, spreadsheetId, dataFeed)
{

	const gsapi = google.sheets(
	{
		version: 'v4',
		auth: cl
	});



	const arr = []
	for (var i = 0; i < string.length; i++)
	{
		arr.push([string[i], "=GOOGLETRANSLATE(\"" + string[i] + "\",\"en\",\"" + lan + "\")"])
	}

	const opt = {
		spreadsheetId: spreadsheetId,
		range: 'Sheet1!A1:B',
		valueInputOption: 'USER_ENTERED',
		resource:
		{
			values: arr
		}

	};

	const opt1 = {
		spreadsheetId: spreadsheetId,
		range: 'Sheet1!A1:B' + string.length

	};
	await gsapi.spreadsheets.values.update(opt);
	const data = await gsapi.spreadsheets.values.get(opt1);
	await gsapi.spreadsheets.values.clear(opt1);

	var obj = {};
	for (var i = 0; i < string.length; i++)
	{
		fres.push(data.data.values[i][1]);
		obj[data.data.values[i][0]] = data.data.values[i][1];
	}
	putKey(dataFeed, "dataFeed", finalObj);
	fres = [];
	console.log("###### Translated #####")
	try
	{
		fs.writeFileSync(process.argv[2] + "-" + lan + '.json', JSON.stringify(dataFeed, null, 4))
		//file written successfully
	}
	catch (err)
	{
		console.error(err)
	}

}
module.exports = localify;