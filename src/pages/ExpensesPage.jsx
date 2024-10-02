import { useState, useMemo, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowsUpDownIcon,
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/24/solid";
import TransactionFilter from "../components/TransactionFilter";
import ExpensesCategoryBar from "../components/charts/ExpensesCategoryBar";
import ExpensesCategoryLine from "../components/charts/ExpensesCategoryLine";
import TrashIconWithCross from "../components/TrashIconWithCross";
import ViewEntryModal from "../components/ViewEntryModal";
import NewEntryModal from "../components/NewEntryModal";
import EditEntryModal from "../components/EditEntryModal";
import { useTransactionContext } from "../contexts/TransactionContext";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { formatDateForInput } from "../utils/dateUtils";

const ExpensesPage = () => {
  //State for toggling between Bar and Line chart
  const [bar, setBar] = useState(true);

  //States for modals (New Entry, Edit Entry, View Entry)
  const [openNewEntryModal, setOpenNewEntryModal] = useState(false);
  const [openEditEntryModal, setOpenEditEntryModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [entryToEdit, setEntryToEdit] = useState(null);

  //Local filters state for filtering transactions
  const [filters, setFilters] = useState({
    title: "",
    category: "",
    amount: "",
    date: "",
    createdDate: "",
  });

  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  //Fetch transactions from context
  const { transactions = [], loading, error } = useTransactionContext();

  //Ensure filters have default values
  const filtersWithDefaults = {
    title: filters.title || "",
    category: filters.category || "",
    amount: filters.amount || "",
    date: filters.date || "",
    createdDate: filters.createdDate || "",
  };

  //Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10; //Number of transactions to display per page

  //Reset currentPage to 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  //Calculate indices for slicing the filtered transactions array
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;

  //Filter transactions to only include expenses
  const expenseTransactions = transactions.filter((t) => t.type === "expense");

  //Format transactions to ensure categories have a default value
  const formattedTransactions = expenseTransactions.map((transaction) => ({
    ...transaction,
    category: transaction.category ?? { title: "Unknown" },
  }));

  //Calculate total expenses using useMemo for performance optimization
  const totalExpenses = useMemo(
    () =>
      expenseTransactions
        .reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0)
        .toFixed(2),
    [expenseTransactions]
  );

  //Total number of transactions
  const totalTransactions = expenseTransactions.length;

  //Calculate average expense
  const averageExpense = useMemo(() => {
    return expenseTransactions.length > 0
      ? (totalExpenses / expenseTransactions.length).toFixed(2)
      : 0;
  }, [totalExpenses, expenseTransactions]);

  //Determine top category by total amount spent
  const topCategory = useMemo(() => {
    const categoryMap = {};
    expenseTransactions.forEach((t) => {
      const categoryTitle = t.category?.title || "Unknown";
      if (!categoryMap[categoryTitle]) {
        categoryMap[categoryTitle] = 0;
      }
      categoryMap[categoryTitle] += parseFloat(t.amount || 0);
    });

    const sortedCategories = Object.entries(categoryMap).sort(
      (a, b) => b[1] - a[1]
    );
    return sortedCategories.length > 0 ? sortedCategories[0][0] : "Unknown";
  }, [expenseTransactions]);

  //Function to toggle between Bar and Line chart
  const toggleChart = () => {
    setBar(!bar);
  };

  //Function to compare dates for filtering
  const compareDates = (expenseDateStr, filterDateStr) => {
    if (!expenseDateStr || !filterDateStr) return false;

    const expenseDate = new Date(expenseDateStr);
    const filterDate = new Date(filterDateStr);

    //Check for invalid dates
    if (isNaN(expenseDate.getTime()) || isNaN(filterDate.getTime())) {
      console.error("Invalid date format:", expenseDateStr, filterDateStr);
      return false;
    }

    //Format both dates to YYYY-MM-DD for comparison
    const formattedExpenseDate = expenseDate.toISOString().split("T")[0];
    const formattedFilterDate = filterDate.toISOString().split("T")[0];

    return formattedExpenseDate === formattedFilterDate;
  };

  //Handle clicks on chart bars to set category filter
  const handleBarClick = (categoryName) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      category: categoryName,
    }));
  };

  //Function to clear all filters
  const clearFilters = () => {
    setFilters({
      title: "",
      category: "",
      amount: "",
      date: "",
      createdDate: "",
    });
  };

  //Check if any filters are active
  const areFiltersActive = () => {
    return Object.values(filters).some((value) => value !== "");
  };

  //Filter transactions based on local filters
  const filteredExpenses = formattedTransactions.filter((transaction) => {
    const transactionTitleLower = (transaction.title || "").toLowerCase();
    const filtersTitleLower = (filtersWithDefaults.title || "").toLowerCase();

    const matchesTitle =
      filtersTitleLower === "" ||
      transactionTitleLower.includes(filtersTitleLower);

    const transactionCategoryTitle = transaction.category?.title || "Unknown";
    const matchesCategory =
      filtersWithDefaults.category === "" ||
      transactionCategoryTitle === filtersWithDefaults.category;

    //Convert amounts to strings for comparison
    const transactionAmountStr = (transaction.amount || "").toString();
    const filterAmountStr = filtersWithDefaults.amount;

    const matchesAmount =
      filtersWithDefaults.amount === "" ||
      transactionAmountStr.startsWith(filterAmountStr);

    const matchesDate =
      filtersWithDefaults.date === "" ||
      compareDates(transaction.date, filtersWithDefaults.date);

    const matchesCreatedDate =
      filtersWithDefaults.createdDate === "" ||
      compareDates(transaction.createdAt, filtersWithDefaults.createdDate);

    return (
      matchesTitle &&
      matchesCategory &&
      matchesAmount &&
      matchesDate &&
      matchesCreatedDate
    );
  });

  //Calculate total number of pages based on filtered expenses
  const totalPages = Math.ceil(filteredExpenses.length / transactionsPerPage);

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    const { key, direction } = sortConfig;
    const order = direction === "asc" ? 1 : -1;

    //Handle sorting for the category column specifically
    let valueA, valueB;

    if (key === "category") {
      valueA = a.category?.title || ""; //Safely access category title
      valueB = b.category?.title || "";
    } else {
      valueA = a[key] ?? "";
      valueB = b[key] ?? "";
    }

    //Apply sorting based on data type
    if (key === "amount") {
      return order * (parseFloat(valueA) - parseFloat(valueB));
    } else if (key === "date" || key === "createdAt") {
      return order * (new Date(valueA) - new Date(valueB));
    } else {
      return valueA.toString().localeCompare(valueB.toString()) * order;
    }
  });

  //Apply pagination to filtered expenses
  const currentTransactions = sortedExpenses.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const handleSort = (key) => {
    setSortConfig((prevSortConfig) => {
      // If the same key is clicked, toggle direction
      const newDirection =
        prevSortConfig.key === key && prevSortConfig.direction === "asc"
          ? "desc"
          : "asc";
      return { key, direction: newDirection };
    });
  };

  // Function to determine the color of the sort icon
  const getIconColor = (key) => {
    return sortConfig.key === key ? "text-red-500" : "text-gray-400"; // Red if active, gray otherwise
  };

  const getSortIcon = (key) => {
    const className =
      "w-5 h-5 inline-block ml-1 align-middle transition-colors duration-200";

    const isActive = sortConfig.key === key;

    return isActive ? (
      sortConfig.direction === "asc" ? (
        <ChevronUpIcon className={`${className} text-red-500`} />
      ) : (
        <ChevronDownIcon className={`${className} text-red-500`} />
      )
    ) : (
      <ArrowsUpDownIcon
        className={`${className} text-gray-400 group-hover:text-gray-200`}
      />
    );
  };
  //Ensure currentPage is within valid range (especially after filtering)
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  //Handle row click to open View Entry modal
  const handleRowClick = (expense) => {
    setEntryToEdit(expense);
    setOpenViewModal(true);
  };

  //Handle edit action from View Entry modal
  const handleEditFromViewModal = () => {
    setOpenViewModal(false);
    setTimeout(() => {
      setOpenEditEntryModal(true);
    }, 0);
  };

  //Handle edit action
  const handleEdit = (expense) => {
    setEntryToEdit(expense);
    setOpenEditEntryModal(true);
  };

  //Handle delete action (functionality to be implemented)
  const handleDelete = (expenseId) => {
    console.log("Delete:", expenseId);
    //Implement delete functionality here
  };

  //Handle page change in pagination
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  //Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  //Show error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="h-screen w-screen flex flex-col text-white">
      <div className="flex flex-grow">
        {/* Main Content */}
        <div className="flex-grow space-y-6 overflow-hidden">
          {/* Cards and Chart Section */}
          <div className="grid grid-cols-3 gap-6">
            {/* Card Section */}
            <div className="col-span-2 grid grid-cols-2 gap-6">
              {/* Total Expenses Card */}
              <div className="p-6 bg-[#161A40] rounded-3xl shadow-lg">
                <h3 className="text-lg font-semibold">Total Expenses</h3>
                <p className="text-3xl font-bold mt-2">${totalExpenses}</p>
              </div>
              {/* Total Transactions Card */}
              <div className="p-6 bg-[#161A40] rounded-3xl shadow-lg">
                <h3 className="text-lg font-semibold">Total Transactions</h3>
                <p className="text-3xl font-bold mt-2">{totalTransactions}</p>
              </div>
              {/* Average Expense Card */}
              <div className="p-6 bg-[#161A40] rounded-3xl shadow-lg">
                <h3 className="text-lg font-semibold">Average Expense</h3>
                <p className="text-3xl font-bold mt-2">${averageExpense}</p>
              </div>
              {/* Top Category Card */}
              <div className="p-6 bg-[#161A40] rounded-3xl shadow-lg">
                <h3 className="text-lg font-semibold">Top Category</h3>
                <p className="text-3xl font-bold mt-2">{topCategory}</p>
              </div>
            </div>

            {/* Chart Section */}
            <div className="bg-[#161A40] p-6 rounded-3xl shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Expenses by Category</h3>
                <button
                  className="px-3 py-1 bg-[#293458] text-white text-sm font-semibold rounded-md hover:bg-cyan-800 transition-colors duration-200 w-24"
                  onClick={toggleChart}
                >
                  {bar ? "Line Chart" : "Bar Chart"}
                </button>
              </div>
              <div className="h-40 rounded-3xl mt-4">
                {bar ? (
                  <ExpensesCategoryBar
                    transactions={formattedTransactions}
                    onBarClick={handleBarClick}
                  />
                ) : (
                  <ExpensesCategoryLine transactions={formattedTransactions} />
                )}
              </div>
            </div>
          </div>

          {/* Latest Transactions Section */}
          <div className="w-full flex flex-col bg-gradient-to-b from-[#121428] to-[#000036] text-white">
            {/* Filter Section */}
            <TransactionFilter
              filters={filters}
              setFilters={setFilters}
              type="expense"
            />
            {/* Transactions Table */}
            <div className="rounded-2xl mt-4 h-[55vh] relative">
              <div className="h-full overflow-y-auto">
                <table className="min-w-full bg-[#161A40] text-gray-300 rounded-3xl">
                  <thead className="bg-[#293458] z-10">
                    <tr className="text-left bg-[#3A3A57]">
                      <th
                        className="p-4 font-bold sticky top-0 bg-[#293458] z-10 rounded-tl-2xl w-1/6"
                        onClick={() => handleSort("title")}
                      >
                        Title{" "}
                        <span className={`${getIconColor("title")}`}>
                          {getSortIcon("title")}
                        </span>
                      </th>
                      <th
                        className="p-4 font-bold sticky top-0 bg-[#293458] z-10 w-1/6"
                        onClick={() => handleSort("category")}
                      >
                        Category{" "}
                        <span className={`${getIconColor("category")}`}>
                          {getSortIcon("category")}
                        </span>
                      </th>
                      <th
                        className="p-4 font-bold sticky top-0 bg-[#293458] z-10 w-1/6"
                        onClick={() => handleSort("amount")}
                      >
                        Amount{" "}
                        <span className={`${getIconColor("amount")}`}>
                          {getSortIcon("amount")}
                        </span>
                      </th>
                      <th
                        className="p-4 font-bold sticky top-0 bg-[#293458] z-10 w-1/6"
                        onClick={() => handleSort("date")}
                      >
                        Date{" "}
                        <span className={`${getIconColor("date")}`}>
                          {getSortIcon("date")}
                        </span>
                      </th>
                      <th
                        className="p-4 font-bold sticky top-0 bg-[#293458] z-10 w-1/6"
                        onClick={() => handleSort("createdAt")}
                      >
                        Created Date{" "}
                        <span className={`${getIconColor("createdAt")}`}>
                          {getSortIcon("createdAt")}
                        </span>
                      </th>
                      <th className="p-4 pl-80 font-bold sticky top-0 bg-[#293458] z-10 rounded-tr-2xl">
                        <button
                          onClick={clearFilters}
                          aria-label="Clear filters"
                          title="Clear filters"
                          className="inline-flex items-center cursor-pointer"
                        >
                          <TrashIconWithCross
                            filtersActive={areFiltersActive()}
                          />
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTransactions.length > 0 ? (
                      currentTransactions.map((expense, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-700 hover:bg-[#293458]/45 transition-colors duration-200 cursor-pointer"
                          onClick={() => handleRowClick(expense)}
                        >
                          <td className="p-4 w-1/6 truncate">
                            {expense.title}
                          </td>
                          <td className="p-4 w-1/6 truncate">
                            {expense.category?.title || "Unknown"}
                          </td>
                          <td className="p-4 w-1/6 truncate">
                            {parseFloat(expense.amount).toFixed(2)}$
                          </td>
                          <td className="p-4 w-1/6 truncate">
                            {formatDateForInput(expense.date)}
                          </td>
                          <td className="p-4 w-1/6 truncate">
                            {expense.createdAt
                              ? formatDateForInput(expense.createdAt)
                              : "N/A"}
                          </td>
                          {/* Action Button inside each row */}
                          <td className="p-4 text-right right-4 top-4">
                            {/* Action Menu */}
                            <Menu
                              as="div"
                              className="relative inline-block text-left"
                            >
                              <MenuButton
                                className="inline-flex justify-center w-full px-2 py-2 text-sm font-medium text-white bg-transparent rounded-md hover:bg-[#293458]/30 focus:outline-none"
                                onClick={(e) => e.stopPropagation()}
                              >
                                ⋮
                              </MenuButton>
                              <MenuItems className="absolute right-0 w-32 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none z-10">
                                <div className="py-1">
                                  <MenuItem
                                    as="button"
                                    className="group flex rounded-md items-center w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-200 data-[active=true]:bg-gray-200"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEdit(expense);
                                    }}
                                  >
                                    Edit
                                  </MenuItem>
                                  <MenuItem
                                    as="button"
                                    className="group flex rounded-md items-center w-full px-2 py-2 text-sm text-red-700 hover:bg-red-200 data-[active=true]:bg-red-200"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(expense._id);
                                    }}
                                  >
                                    Delete
                                  </MenuItem>
                                </div>
                              </MenuItems>
                            </Menu>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="p-4 text-center" colSpan="6">
                          No transactions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Pagination Component */}
            <div className="flex justify-center mt-4">
              <Stack spacing={2}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  variant="outlined"
                  shape="rounded"
                  className="custom-pagination"
                />
              </Stack>
            </div>
          </div>

          {/* View Entry Modal */}
          {entryToEdit && (
            <ViewEntryModal
              open={openViewModal}
              setOpen={setOpenViewModal}
              entry={entryToEdit}
              onEdit={handleEditFromViewModal}
            />
          )}
          {/* New Entry Modal */}
          <NewEntryModal
            open={openNewEntryModal}
            setOpen={setOpenNewEntryModal}
            defaultCategory="Expense"
          />
          {/* Edit Entry Modal */}
          {entryToEdit && (
            <EditEntryModal
              open={openEditEntryModal}
              setOpen={setOpenEditEntryModal}
              entry={entryToEdit}
            />
          )}
          {/* Floating "+" Button */}
          <button
            className="bg-orange-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl fixed bottom-10 right-10"
            onClick={() => setOpenNewEntryModal(true)}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;
