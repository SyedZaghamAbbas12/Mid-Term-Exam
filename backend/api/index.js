const app = require('../server.js')
export default function handler(req,res){
    return app(req,res);
}