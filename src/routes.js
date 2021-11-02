const express = require('express');
const routes = express.Router(); //serve para criar rotas via express

const views = __dirname + "/views/"


//const basePath = __dirname + "/view"; <--- essa linha se tornaria desnecessária com o uso do ejs, que por 
//padrão já 'enxerga' a pasta views, porém nesse projeto a mesma está dentro de src, sendo necessária uma
//adaptação
//--- também por conta dele não é necessária a extensão .html

const Profile = {
    data: {
        name: "Nycolas",
        avatar: "https://avatars.githubusercontent.com/u/81642126?v=4",
        "monthly-budget": 2500,
        "days-per-week": 5,
        "hours-per-day": 6,
        "vacation-per-year": 5,
        "hour-value": 75
        },

    controllers: {
        index(req, res) {
            console.log('Profile acessado')
            return res.render(views + "profile", { profile: Profile.data })
        },
        
        update(req, res) {
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
            
            Profile.data = {
                ...Profile.data,
                ...req.body,
                "hour-value": hourValue
            }

            return res.redirect('/profile')
        }
    },
}
 

const Job = {
    data: [
        {
            id: 1,
            name: "Pizzaria Guloso",
            'daily-hours': 2,
            'total-hours': 1,
            createdAt: Date.now(),
            
        },
        {
            id: 2,
            name: "OneTwo Project",
            'daily-hours': 3,
            'total-hours': 47,
            createdAt: Date.now(),
            
        }
    ],

    controllers: {
        index(req, res) {

                const updatedJobs = Job.data.map((job) => {
                //aqui serão feitos os cálculos, dados e informações referentes aos
                //jobs, para que sejam atualizados sempre que o get for feito no index
                
                const deadline = Job.services.remainingDays(job)
                const status = deadline <= 0 ? 'done' : 'progress'
                
                return {
                    ...job,
                    deadline,
                    status,
                    budget: Job.services.calculateBudget(job, Profile.data["hour-value"]) 
                } //aqui usamos spread syntax (sintaxe de espalhamento) para "espalhar" as propriedades do objeto "job" no novo objeto
            })
                                
                console.log('Index acessado')
                return res.render(views + "index", { jobs: updatedJobs }) 
                // esse formato de inserir um objeto como parametro para o res.render()
                //passa o array jobs[] que criamos acima para dentro do HTML "index"
            },

        create(req, res) {
            
                console.log('job acessado')
                return res.render(views + "job")
        },

        save(req, res) {
                
                const lastId = Job.data[Job.data.length -1]?.id || 0
            
                Job.data.push({
                    id: lastId + 1,
                    name: req.body.name,
                    'daily-hours': req.body["daily-hours"],
                    'total-hours': req.body["total-hours"],
                    createdAt: Date.now() // atribuindo data de hoje em milissegundos desde 01/01/1970
                })
                return res.redirect('/')
            
        },

        show(req,res) {
            console.log('job edit acessado')

            const jobId = req.params.id // req.params pega os parâmetros da requisição, nesse caso puxando o ID na URl
            const job = Job.data.find(job => Number(job.id) === Number(jobId)) 

            if (!job) {
                console.log('id não encontrado')
                return res.send('Job not found!')
            }

            job.budget = Job.services.calculateBudget(job, Profile.data["hour-value"])
            return res.render(views + "job-edit", { job })
        },

        update(req, res) {
            const jobId = req.params.id // req.params pega os parâmetros da requisição, nesse caso puxando o ID na URl
            const job = Job.data.find(job => Number(job.id) === Number(jobId)) 

            if (!job) {
                console.log('id não encontrado')
                return res.send('Job not found!')
            }

            const updatedJob = {
                ...job,
                name: req.body.name,
                "total-hours": req.body["total-hours"],
                "daily-hours": req.body["daily-hours"]
            }

            Job.data = Job.data.map(job => {
                if (Number(job.id) === Number(jobId)) {
                    job = updatedJob
                }

                return job
            })

            res.redirect('/job/' + jobId)
        },

        delete(req, res) {
            const jobId = req.params.id //req.params pega os parâmetros da requisição, nesse caso puxando o ID
            
            Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId))
            return res.redirect('/')
        }
    },

    services: {
        
        remainingDays(job) {
            const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed() 
            //toFixed() é usado para arredondamento matemático 
            
            const createdDate = new Date(job.createdAt)  //cria um objeto de data a partir do "createdAt"
            const dueDay = createdDate.getDate() + Number(remainingDays) //cria o prazo final, somando os dias restantes à data de criação
            const dueDateInMs = createdDate.setDate(dueDay) //cria um objeto de data a partir do prazo final, em milissegundos
        
            const timeDiffInMs = dueDateInMs - Date.now() //cria a diferença entre o prazo final e a data atual em milissegundos
            
            const dayInMs = 1000 * 60 * 60 * 24 //transformar milissegundos em dias
            const dayDiff = Math.floor(timeDiffInMs / dayInMs) //cria a diferença em dias, arredondando para baixo por segurança
        
        
            return dayDiff //retorna essa diferença
        },
        
        calculateBudget: (job, hourValue) => hourValue * job["total-hours"]
    }
}



//req, res
routes.get('/', Job.controllers.index);
routes.get('/job', Job.controllers.create);
routes.post('/job', Job.controllers.save);
routes.get('/job/:id', Job.controllers.show);
routes.post('/job/:id', Job.controllers.update);
routes.post('/job/delete/:id', Job.controllers.delete);
routes.get('/profile', Profile.controllers.index);
routes.post('/profile', Profile.controllers.update);

module.exports = routes;