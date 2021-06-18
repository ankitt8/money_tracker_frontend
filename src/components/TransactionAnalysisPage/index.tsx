import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

import DayTransactionsCard from 'components/TransactionCardWrapper';
import { DEBIT_TYPE } from 'Constants';
import {
  checkDebitTypeTransaction,
  getTransactionCategoriesFromDB,
  getTransactionsFromDB,
} from 'helper';
import { CategoryAmountArray, Transaction } from 'interfaces/index.interface';

import styles from './styles.module.scss';
import { getTransactionCategories, getTransactionsAction } from 'actions/actionCreator';
import { TransactionAnalysisPage as TransactionAnalyisisPageProps, TransactionsGroupedByCategories } from './interface';
import Loader from 'components/Loader';
import { ReduxStore } from 'reducers/interface';

const sortCategoriesDescByTotalAmount = (transactionsGroupedByCategories: TransactionsGroupedByCategories) => {
  const categoryAmountArray: CategoryAmountArray[] = [];
  Object.keys(transactionsGroupedByCategories).forEach((category: string) => {
    categoryAmountArray.push({
      category,
      totalAmount: transactionsGroupedByCategories[category]['totalAmount'],
    });
  });

  categoryAmountArray.sort((a, b) => {
    return b.totalAmount - a.totalAmount;
  });
  return categoryAmountArray.map((categoryAmount) => categoryAmount.category);
}

const createTransactionsGroupedByCategories = (
  transactions: Transaction[], categories: string[]
) => {
  let transactionsGroupedByCategories: TransactionsGroupedByCategories = {
    'No Category': {
      transactions: [],
      totalAmount: 0,
    }
  };

  categories.forEach((category: string) => {
    transactionsGroupedByCategories[category] = {
      transactions: [],
      totalAmount: 0,
    }
  });

  transactions.forEach(transaction => {
    const { category, amount } = transaction;
    if (category === '' || category === undefined) {
      transactionsGroupedByCategories['No Category']['transactions'].push(transaction);
      transactionsGroupedByCategories['No Category'].totalAmount += amount;
    } else {
      // for now user can add transaction without category
      // reason have not yet made category required
      transactionsGroupedByCategories[category]['transactions'].push(transaction);
      transactionsGroupedByCategories[category].totalAmount += amount;
    }
  });

  return transactionsGroupedByCategories;
}

const TransactionAnalysisPage = ({ userId }: TransactionAnalyisisPageProps) => {
  const dispatch = useDispatch();
  const transactions = useSelector((state: ReduxStore) => state.transactions.transactions);
  const transactionsEmpty = transactions.length === 0;
  let transactionCategories = useSelector((state: ReduxStore) => state.transactions.categories);
  const transactionCategoriesEmpty = transactionCategories.credit.length === 0 && transactionCategories.debit.length === 0;

  const [loader, setLoader] = useState(() => transactionsEmpty || transactionCategoriesEmpty);
  // if either no transactions are present in the store
  // or if no categoires are present in the store set the loader true
  // fetch the data set loader false


  let categories: string[];

  const loadTransactions = useCallback(() => {
    getTransactionsFromDB(userId)
      .then((transactions) => {
        dispatch(getTransactionsAction(transactions));
      })
  }, []);

  const loadTransactionCategories = useCallback(() => {
    getTransactionCategoriesFromDB(userId)
      .then(({ transactionCategories: dbTransactionCategories }) => {
        dispatch(getTransactionCategories(dbTransactionCategories));
        // need to figure out later and dig deep why the loader was set before the 
        // https://github.com/reduxjs/react-redux/issues/1298
        // https://github.com/reduxjs/react-redux/issues/1428
        // links:- https://codesandbox.io/s/suspicious-merkle-0kzcg?file=/src/index.js
        // The below code shows No Transactions First then shown the analysiss which is bug

        setLoader(() => loader && false);
      });
  }, []);


  useEffect(() => {
    // if the redux store transaction categoires are empty then fetch the
    // transaction categories
    // this will happen when analysis page is visited before categoires page is visited

    /* TODO */
    // If transactions are added in different device
    // and user visits transaction analysis page directly in other device
    // the transactions will not be in sync 
    // because I am loading the transactions or categories only when
    // the redux store categories or transactions are empty
    if (transactionsEmpty) {
      loadTransactions();
    }
    if (transactionCategoriesEmpty) {
      loadTransactionCategories();
    }

  }, []);


  // If user directly visits the analysis page then he will not see updated transactions
  // reason the store gets updated when home page is visited
  // so suppose user changes transaction on say laptop and he visits 
  // analysis page on mobile without going to homepage he will not see the refreshed contents
  // If I need to get the transactions for each page then will probably will have to rethink if 
  // storing transactions in redux store is actually required

  // in future will give filters where based on filter applied type will be choose

  const type = DEBIT_TYPE;
  let componentToRender;

  let filteredTransactions = transactions.filter(checkDebitTypeTransaction)
  categories = type === DEBIT_TYPE ? transactionCategories.debit : transactionCategories.credit;

  if (loader) {
    componentToRender = <Loader />;
  } else if (filteredTransactions.length === 0) {
    componentToRender = <p className={styles.noData}>!!No Transactions Found!!</p>
  } else {
    const transactionsGroupedByCategories: TransactionsGroupedByCategories =
      createTransactionsGroupedByCategories(filteredTransactions, categories);

    const categoriesSortedDescTotalAmount = sortCategoriesDescByTotalAmount(transactionsGroupedByCategories);

    const TransactionAnalysisCards = categoriesSortedDescTotalAmount.map((category) => (
      <motion.li
        key={category}
        layout
      >
        <DayTransactionsCard
          title={category}
          transactions={transactionsGroupedByCategories[category]['transactions']}
          totalAmount={transactionsGroupedByCategories[category]['totalAmount']}
        />
      </motion.li>
    ))

    componentToRender = <ul className={styles.transactionAnalysisPage}>{TransactionAnalysisCards}</ul>
  }
  return componentToRender;
}

export default TransactionAnalysisPage;