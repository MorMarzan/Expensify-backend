import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import mongodb from 'mongodb'
const { ObjectId } = mongodb

export const expenseService = {
    remove,
    query,
    getById,
    add,
    update,
}

async function query(userId) {
    try {
        const criteria = { userId: userId }
        const collection = await dbService.getCollection('expense')
        var expenseCursor = await collection.find(criteria)

        const expenses = expenseCursor.toArray()
        return expenses
    } catch (err) {
        logger.error('cannot find expenses', err)
        throw err
    }
}

async function getById(expenseId, userId) {
    try {
        const collection = await dbService.getCollection('expense')
        const expense = await collection.findOne({ _id: ObjectId(expenseId) })
        if (expense.userId != userId) throw new Error('Not Authorized')
        return expense
    } catch (err) {
        logger.error(`while finding expense ${expenseId}`, err)
        throw err
    }
}

async function remove(expenseId) {
    try {
        const collection = await dbService.getCollection('expense')
        await collection.deleteOne({ _id: ObjectId(expenseId) })
        return expenseId
    } catch (err) {
        logger.error(`cannot remove expense ${expenseId}`, err)
        throw err
    }
}

async function add(expense) {
    try {
        const collection = await dbService.getCollection('expense')
        await collection.insertOne(expense)
        return expense
    } catch (err) {
        logger.error('cannot insert expense', err)
        throw err
    }
}

async function update(expense) {
    try {
        const expenseToSave = {
            category: expense.category,
            amount: expense.amount,
            note: expense.note || ''
        }
        const collection = await dbService.getCollection('expense')
        await collection.updateOne({ _id: ObjectId(expense._id) }, { $set: expenseToSave })
        return expense
    } catch (err) {
        logger.error(`cannot update expense ${expense._id}`, err)
        throw err
    }
}

