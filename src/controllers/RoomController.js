const Database = require('../db/config')

module.exports = {
  async create(req, res) {
    const db = await Database()
    const pass = req.body.password
    let roomId
    let isRoom = true

    while (isRoom) {
      //gerar numero aleatori de 6 casas decimais
      for (let index = 0; index < 6; index++) {
        index == 0
          ? (roomId = Math.floor(Math.random() * 10).toString())
          : (roomId += Math.floor(Math.random() * 10).toString())
      }
      /*Verficar se existe */
      const roomsExistIds = await db.all(`SELECT id FROM rooms`)
      isRoom = roomsExistIds.some(roomExistId => roomExistId === roomId)

      /*Gera a sala no banco */
      if (!isRoom) {
        await db.run(`INSERT INTO rooms (
          id,
          pass
        ) VALUES (
          ${parseInt(roomId)},
          ${pass}
        )`)
      }
    }

    await db.close()

    res.redirect(`/room/${roomId}`)
  },
  async open(req, res) {
    const db = await Database()
    const roomId = req.params.room

    const questions = await db.all(
      `SELECT * FROM questions WHERE room = ${roomId} and read = 0`
    )
    const questionsRead = await db.all(
      `SELECT * FROM questions WHERE room = ${roomId} and read = 1`
    )

    res.render('room', {
      roomId: roomId,
      questions: questions,
      questionsRead: questionsRead
    })
  }
}
