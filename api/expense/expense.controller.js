import { expenseService } from './expense.service.js'
import { logger } from '../../services/logger.service.js'

export async function getExpenses(req, res) {
  try {
    const expenses = await expenseService.query(req.loggedinUser._id)
    res.json(expenses)
  } catch (err) {
    logger.error('Failed to get expenses', err)
    res.status(400).send({ err: 'Failed to get expenses' })
  }
}

export async function getExpenseById(req, res) {
  try {
    const userId = req.loggedinUser._id
    const expenseId = req.params.id
    const expense = await expenseService.getById(expenseId, userId)
    res.json(expense)
  } catch (err) {
    logger.error('Failed to get expense', err)
    res.status(400).send({ err: 'Failed to get expense' })
  }
}

export async function addExpense(req, res) {
  const { loggedinUser } = req

  try {
    const expense = {
      amount: +req.body.amount || 0,
      category: req.body.category || '',
      note: req.body.note || '',
      userId: loggedinUser._id,
      date: Date.now()
    }

    const addedExpense = await expenseService.add(expense)
    res.json(addedExpense)
  } catch (err) {
    logger.error('Failed to add expense', err)
    res.status(400).send({ err: 'Failed to add expense' })
  }
}

// from here on there's no protection against froeign users
export async function updateExpense(req, res) {
  try {
    const expense = req.body
    const expenseId = req.params.id
    expense._id = expenseId
    const updatedExpense = await expenseService.update(expense)
    res.json(updatedExpense)
  } catch (err) {
    logger.error('Failed to update expense', err)
    res.status(400).send({ err: 'Failed to update expense' })

  }
}

export async function removeExpense(req, res) {
  try {
    const expenseId = req.params.id
    const removedId = await expenseService.remove(expenseId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove expense', err)
    res.status(400).send({ err: 'Failed to remove expense' })
  }
}

