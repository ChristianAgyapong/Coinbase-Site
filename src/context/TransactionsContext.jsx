import { createContext, useContext, useState, useEffect } from 'react';

const TransactionsContext = createContext();

export function useTransactions() {
  return useContext(TransactionsContext);
}

export function TransactionsProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [
      { id: 1, description: 'Salary', amount: 5000, type: 'income', date: new Date().toISOString() },
      { id: 2, description: 'Rent', amount: 1200, type: 'expense', date: new Date().toISOString() },
      { id: 3, description: 'Groceries', amount: 300, type: 'expense', date: new Date().toISOString() },
    ];
  });

  const [savingsGoals, setSavingsGoals] = useState(() => {
    const saved = localStorage.getItem('savings_goals');
    return saved ? JSON.parse(saved) : [
      { id: 101, name: 'Emergency Fund', target: 5000, saved: 1400, createdAt: new Date().toISOString() },
    ];
  });

  const [paymentRequests, setPaymentRequests] = useState(() => {
    const saved = localStorage.getItem('payment_requests');
    return saved ? JSON.parse(saved) : [
      {
        id: 201,
        title: 'Community Mobility Fund',
        purpose: 'Support transport for seniors and less mobile people.',
        target: 2000,
        collected: 650,
        createdAt: new Date().toISOString(),
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('savings_goals', JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  useEffect(() => {
    localStorage.setItem('payment_requests', JSON.stringify(paymentRequests));
  }, [paymentRequests]);

  const addTransaction = (transaction) => {
    setTransactions(prev => [{ id: Date.now(), date: new Date().toISOString(), ...transaction }, ...prev]);
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addSavingsGoal = ({ name, target }) => {
    setSavingsGoals(prev => [
      {
        id: Date.now(),
        name,
        target: Number(target),
        saved: 0,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const contributeToGoal = ({ goalId, amount }) => {
    setSavingsGoals(prev => prev.map(goal => {
      if (goal.id !== goalId) return goal;
      const updatedSaved = Math.min(Number(goal.target), Number(goal.saved) + Number(amount));
      return { ...goal, saved: updatedSaved };
    }));
  };

  const addPaymentRequest = ({ title, purpose, target }) => {
    setPaymentRequests(prev => [
      {
        id: Date.now(),
        title,
        purpose,
        target: Number(target),
        collected: 0,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const collectPayment = ({ requestId, amount }) => {
    setPaymentRequests(prev => prev.map(request => {
      if (request.id !== requestId) return request;
      const updatedCollected = Math.min(Number(request.target), Number(request.collected) + Number(amount));
      return { ...request, collected: updatedCollected };
    }));
  };

  const calculateBalance = () => {
    return transactions.reduce((acc, curr) => {
      return curr.type === 'income' ? acc + Number(curr.amount) : acc - Number(curr.amount);
    }, 0);
  };

  const getIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((acc, curr) => acc + Number(curr.amount), 0);
  };

  const getExpenses = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + Number(curr.amount), 0);
  };

  return (
    <TransactionsContext.Provider value={{ 
      transactions, 
      addTransaction, 
      deleteTransaction,
      savingsGoals,
      addSavingsGoal,
      contributeToGoal,
      paymentRequests,
      addPaymentRequest,
      collectPayment,
      balance: calculateBalance(),
      totalIncome: getIncome(),
      totalExpenses: getExpenses()
    }}>
      {children}
    </TransactionsContext.Provider>
  );
}
