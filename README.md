# TON most profitable giver

#### Get most profitable giver for current time and write it to ```process.env.GIVER_PATH``` or ```mostProfitableGiver.txt```

Install dependencies:
```
npm i
```

Usage:
```
npm start
```
or in your code:

```
const {getMostProfitableGiver} = require('ton-most-profitable-giver');

getMostProfitableGiver().then(giver => console.log(giver));
```

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
