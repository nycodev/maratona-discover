const Profile = require('../model/profile')

module.exports = {
    async index(req, res) {
        console.log('Profile acessado')
        return res.render("profile", {  profile: await Profile.get() })
    },
    
    async update(req, res) {
        //req.body para pegar os dados
        const data = req.body
        // vamos definir quantas semanas tem um ano: 52
        const weeksPerYear = 52
        // vamos remover as semanas de férias do ano, e pegar quantas semanas tem em 1 mês 
        const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12
        //quantas horas por semana estou trabalhando // total de hroas trabalhadas no mes 
        const hoursPerWeek = data["hours-per-day"] * data["days-per-week"]

        //horas trabalhadas por mês
        const monthlyTotalHours = hoursPerWeek * weeksPerMonth 

        //qual será o valor da minha hora ?
        hourValue = data["monthly-budget"] / monthlyTotalHours
        
        const profile = await Profile.get()
         await Profile.update({
            ...profile,
            ...req.body,
            "hour-value": hourValue     
        })

        return res.redirect('/profile')
    }
}