import {
  SET_CREDIT_DEBIT_ZERO,
  ADD_TRANSACTION,
  ADD_TRANSACTION_CATEGORY,
  DELETE_TRANSACTION,
  DELETE_TRANSACTION_CATEGORY,
  EDIT_BANK_BALANCE,
  EDIT_BANK_CREDIT,
  EDIT_BANK_DEBIT,
  EDIT_CASH_BALANCE,
  EDIT_CASH_CREDIT,
  EDIT_CASH_DEBIT,
  EDIT_TRANSACTION,
  GET_TRANSACTIONS,
  GET_TRANSACTION_CATEGORIES,
  UPDATE_STATUS,
} from '../actions/actionTypes';
import { DEBIT_TYPE } from '../Constants';

const initialState = {
  transactions: [],

  transactionSummary: {
    bank: {
      credit: 0,
      debit: 0,
      balance: 0,
    },
    cash: {
      credit: 0,
      debit: 0,
      balance: 0,
    }
  },
  status: {
    showFeedback: null,
    msg: null,
    severity: null,
  },
  categories: {
    credit: [],
    debit: [],
  }
};
const transactions = (state = initialState, action) => {
  switch (action.type) {
    case SET_CREDIT_DEBIT_ZERO: {
      return {
        ...state,
        transactionSummary: {
          bank: {
            credit: 0,
            debit: 0,
            balance: 0,
          },
          cash: {
            credit: 0,
            debit: 0,
            balance: 0,
          }
        }
      }
    }
    case ADD_TRANSACTION: {
      return {
        ...state,
        transactions: [...state.transactions, action.transaction],
      };
    }
    case GET_TRANSACTION_CATEGORIES: {
      return {
        ...state,
        categories: { ...action.transactionCategories }
      }
    }
    case ADD_TRANSACTION_CATEGORY: {
      let { debit, credit } = state.categories;
      if (action.transactionType === DEBIT_TYPE) {
        debit = [...debit, action.category]
      } else {
        credit = [...credit, action.category]
      }
      return {
        ...state,
        categories: { debit, credit }
      }
    }
    case DELETE_TRANSACTION_CATEGORY: {
      const { debit, credit } = state.categories;
      const category = action.category;
      if (action.transactionType === DEBIT_TYPE) {
        debit.splice(debit.findIndex((debitCategory) => debitCategory === category), 1)
      } else {
        credit.splice(credit.findIndex((creditCategory) => creditCategory === category), 1)
      }
      return {
        ...state,
        categories: { ...state.categories, debit, credit }
      }
    }
    case GET_TRANSACTIONS: {
      return {
        ...state,
        transactions: [...action.transactions]
      }
    }
    case EDIT_TRANSACTION: {
      const transactions = state.transactions;
      const editTransactionId = transactions.findIndex((transaction) => transaction._id === action.payload._id);
      transactions[editTransactionId] = action.payload.updatedTransaction;
      return {
        ...state,
        transactions: [...transactions]
      }
    }
    case DELETE_TRANSACTION: {
      const deleteId = action.payload;
      const transactions = state.transactions;
      const index = transactions.findIndex((transaction) => transaction._id === deleteId);
      transactions.splice(index, 1);
      return {
        ...state,
        transactions: [...transactions],
      }
    }
    case UPDATE_STATUS: {
      return {
        ...state,
        status: {
          ...state.status,
          ...action.payload
        }
      }
    }
    case EDIT_BANK_CREDIT: {
      const credit = state.transactionSummary.bank.credit + action.amount;
      return {
        ...state,
        transactionSummary: { ...state.transactionSummary, bank: { ...state.transactionSummary.bank, credit } }
      }
    }
    case EDIT_BANK_DEBIT: {
      const debit = state.transactionSummary.bank.debit + action.amount;
      return {
        ...state,
        transactionSummary: { ...state.transactionSummary, bank: { ...state.transactionSummary.bank, debit } }
      }
    }
    case EDIT_BANK_BALANCE: {
      const balance = state.transactionSummary.bank.balance + action.amount;
      return {
        ...state,
        transactionSummary: { ...state.transactionSummary, bank: { ...state.transactionSummary.bank, balance } }
      }
    }
    case EDIT_CASH_CREDIT: {
      const credit = state.transactionSummary.cash.credit + action.amount;
      return {
        ...state,
        transactionSummary: { ...state.transactionSummary, cash: { ...state.transactionSummary.cash, credit } }
      }
    }
    case EDIT_CASH_DEBIT: {
      const debit = state.transactionSummary.cash.debit + action.amount;
      return {
        ...state,
        transactionSummary: { ...state.transactionSummary, cash: { ...state.transactionSummary.cash, debit } }
      }
    }
    case EDIT_CASH_BALANCE: {
      const balance = state.transactionSummary.cash.balance + action.amount;
      return {
        ...state,
        transactionSummary: { ...state.transactionSummary, cash: { ...state.transactionSummary.cash, balance } }
      }
    }
    default: {
      return state;
    }
  }
};
export default transactions;
