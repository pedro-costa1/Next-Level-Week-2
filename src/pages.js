const Database = require('./database/db')

// vv Desestruturar, ao invés de importar um método de um objeto, eu importo cada variável com seu nome original:
const {
  subjects,
  weekdays,
  getSubject,
  converteHoursToMinutes,
} = require('./utils/format')

function pageLanding(req, res) {
  return res.render('index.html')
}

async function pageStudy(req, res) {
  // Dados recebidos da página
  const filters = req.query

  // Para verificar se todas as informações necessárias estão no filtro
  if (!filters.subject || !filters.weekday || !filters.time) {
    // Se algo estiver vazio ele retorna a página:
    return res.render('study.html', { filters, subjects, weekdays })
  }

  // Converter horas em minutos
  const timeToMinutes = converteHoursToMinutes(filters.time)

  const query = `
      SELECT classes.*, proffys.*
      FROM proffys
      JOIN classes ON (classes.proffy_id = proffys.id)
      WHERE EXISTS (
          SELECT class_schedule.*
          FROM class_schedule
          WHERE class_schedule.class_id = classes.id
          AND class_schedule.weekday = ${filters.weekday}
          AND class_schedule.time_from <= ${timeToMinutes}
          AND class_schedule.time_to > ${timeToMinutes}
      )
      AND classes.subject = '${filters.subject}'
    `

  // Retornar a função, com sucesso e, caso haja erro na hora da consulta de dados (catch)
  try {
    const db = await Database
    const proffys = await db.all(query)

    //Transformar o numero em dia da semana
    proffys.map(proffy => {
      proffy.subject = getSubject(proffy.subject)
    })

    return res.render('study.html', { proffys, subjects, filters, weekdays })
  } catch (error) {
    console.log(error)
  }
}

function pageGiveClasses(req, res) {
  return res.render('give-classes.html', { subjects, weekdays })
}

async function saveClasses(req, res) {
  const createProffy = require('./database/createProffy')
  // // Dados recebidos da página, usar o body, não query para dados não ficarem expostos no endereço
  // const data = req.body

  const proffyValue = {
    name: req.body.name,
    avatar: req.body.avatar,
    whatsapp: req.body.whatsapp,
    bio: req.body.bio,
  }

  const classValue = {
    subject: req.body.subject,
    cost: req.body.cost,
  }

  const classScheduleValues = req.body.weekday.map((weekday, index) => {
    return {
      weekday: weekday,
      time_from: converteHoursToMinutes(req.body.time_from[index]),
      time_to: converteHoursToMinutes(req.body.time_to[index]),
    }
  })

  try {
    const db = await Database
    await createProffy(db, { proffyValue, classValue, classScheduleValues })

    //levar para a página study com o perfil do proffy
    let queryString = '?subject=' + req.body.subject
    queryString += '&weekday=' + req.body.weekday[0]
    queryString += '&time=' + req.body.time_from[0]

    return res.redirect('/study' + queryString)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  pageLanding,
  pageStudy,
  pageGiveClasses,
  saveClasses,
}