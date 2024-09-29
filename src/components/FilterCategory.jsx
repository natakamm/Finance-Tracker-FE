const FilterCategory = (transactions, type) => {
  const filtered = transactions.filter((tr) => tr.type === type);

  // Group filtered transactions by category
  const grouped = filtered.reduce((group, transaction) => {
    const category =
      typeof transaction.category === "object"
        ? transaction.category.title // Access the name property if category is an object
        : transaction.category; // Use directly if category is a string

    // Initialize the group for the category if it doesn't exist
    group[category] = group[category] ?? [];
    group[category].push(transaction);
    return group;
  }, {});

  // For each category, calculate the sum of amounts
  const categorySums = Object.keys(grouped).map((category) => {
    const totalAmount = grouped[category].reduce((sum, tr) => {
      return sum + parseFloat(tr.amount);
    }, 0);

    return { category, totalAmount };
  });

  return categorySums;
};

export default FilterCategory;
