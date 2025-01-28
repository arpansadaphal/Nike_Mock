import React from "react";

const FilterComponent = ({ filters, handleFilterChange }) => {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>

      <div className="mb-4">
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          value={filters.category || ""}
          onChange={(e) =>
            handleFilterChange({
              target: { name: e.target.name, value: e.target.value },
            })
          }
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
        >
          <option value="">All</option>
          <option value="running">Running</option>
          <option value="sneakers">Sneakers</option>
          <option value="jordon">Jordons</option>
          <option value="football">Football</option>
          <option value="basketball">Basketball</option>
          <option value="gymandtraining">Gym And Training</option>
          <option value="tennis">Tennis</option>
        </select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="gender"
          className="block text-sm font-medium text-gray-700"
        >
          Gender
        </label>
        <select
          id="gender"
          name="gender"
          value={filters.gender || ""}
          onChange={(e) =>
            handleFilterChange({
              target: { name: e.target.name, value: e.target.value },
            })
          }
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
        >
          <option value="">All</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
        </select>
      </div>

      <div className="mb-4">
        {/* <label
          htmlFor="price_min"
          className="block text-sm font-medium text-gray-700"
        >
          Min Price
        </label> */}
        <input
          type="number"
          id="price_min"
          name="price_min"
          value={filters.price_min || ""}
          onChange={(e) =>
            handleFilterChange({
              target: { name: e.target.name, value: e.target.value },
            })
          }
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
          placeholder="Enter Min Price"
        />
      </div>

      <div className="mb-4">
        {/* <label
          htmlFor="price_max"
          className="block text-sm font-medium text-gray-700"
        >
          Max Price
        </label> */}
        <input
          type="number"
          id="price_max"
          name="price_max"
          value={filters.price_max || ""}
          onChange={(e) =>
            handleFilterChange({
              target: { name: e.target.name, value: e.target.value },
            })
          }
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
          placeholder="Enter Max Price"
        />
      </div>

      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="pricelowtohigh"
          name="pricelowtohigh"
          checked={filters.pricelowtohigh || false}
          onChange={(e) =>
            handleFilterChange({
              target: {
                name: e.target.name,
                value: e.target.checked,
              },
            })
          }
          className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
        />
        <label
          htmlFor="pricelowtohigh"
          className="ml-2 text-sm font-medium text-gray-700"
        >
          Price Low To High
        </label>
      </div>
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="pricehightolow"
          name="pricehightolow"
          checked={filters.pricehightolow || false}
          onChange={(e) =>
            handleFilterChange({
              target: {
                name: e.target.name,
                value: e.target.checked,
              },
            })
          }
          className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
        />
        <label
          htmlFor="pricehightolow"
          className="ml-2 text-sm font-medium text-gray-700"
        >
          Price High To Low
        </label>
      </div>
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="new_arrivals"
          name="new_arrivals"
          checked={filters.new_arrivals || false}
          onChange={(e) =>
            handleFilterChange({
              target: {
                name: e.target.name,
                value: e.target.checked,
              },
            })
          }
          className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
        />
        <label
          htmlFor="new_arrivals"
          className="ml-2 text-sm font-medium text-gray-700"
        >
          New Arrivals
        </label>
      </div>

      {/* <button
        onClick={() =>
          handleFilterChange({ target: { name: "reset", value: {} } })
        }
        className="mt-4 w-full bg-black text-white py-2 rounded-md text-sm font-medium hover:bg-gray-800"
      >
        Reset Filters
      </button> */}
    </div>
  );
};

export default FilterComponent;
