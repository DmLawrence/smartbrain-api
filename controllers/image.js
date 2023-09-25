const Clarifai = require('clarifai');

const handleApiCall = (req, res) => {
	const { input } = req.body;
 	const PAT = '73a1555b70cf4029b92babedb3a34160';
    const IMAGE_URL = input;
    const raw = JSON.stringify({
      "user_app_id": {
        "user_id": "the_davlaw",
        "app_id": "SmartBrain"
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT 
        },
        body: raw
    };

    // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
    // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // this will default to the latest version_id
    fetch(`https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs`, requestOptions)
    .then(res => res.json())
    .then(data => {
    	res.json(data);
    })
    .catch(err => res.status(400).json('Unable to work with API'))

}

const handleImage = (db) => (req, res) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0].entries);
	})
	.catch(err => res.status(400).json('unable to get entries'));
}

module.exports = {
	handleImage,
	handleApiCall
};