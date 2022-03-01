module.exports =  {
        
    remainingDays(job) {
        const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed() 
        //toFixed() é usado para arredondamento matemático 
        
        const createdDate = new Date(job.created_at)  //cria um objeto de data a partir do "createdAt"
        const dueDay = createdDate.getDate() + Number(remainingDays) //cria o prazo final, somando os dias restantes à data de criação
        const dueDateInMs = createdDate.setDate(dueDay) //cria um objeto de data a partir do prazo final, em milissegundos
    
        const timeDiffInMs = dueDateInMs - Date.now() //cria a diferença entre o prazo final e a data atual em milissegundos
        
        const dayInMs = 1000 * 60 * 60 * 24 //transformar milissegundos em dias
        const dayDiff = Math.floor(timeDiffInMs / dayInMs) //cria a diferença em dias, arredondando para baixo por segurança
    
    
        return dayDiff //retorna essa diferença
    },
    
    calculateBudget: (job, hourValue) => hourValue * job["total-hours"]
}