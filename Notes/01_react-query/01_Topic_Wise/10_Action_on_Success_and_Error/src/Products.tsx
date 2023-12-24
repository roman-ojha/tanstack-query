import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Product {
  id: number;
  thumbnail: string;
  title: string;
  category: string;
  price: number;
}

// Overview: https://tanstack.com/query/v5/docs/react/overview

const ProductV1 = () => {
  // What we used to do before on data fetching is we used to use 'useEffect' for data fetching and 'useState' to store the data

  const [products, setProducts] = useState<Product[]>([]);

  // Creating loading spinner state
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // to hand the error what we can do is we can add error state
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      // here we are using try catch block to hand the fetch error
      try {
        setIsLoading(true);
        setError(null);
        // using valid link and fetch products with status 200
        const res = await fetch("https://dummyjson.com/products");

        // using invalid link and which throw the error
        // const res = await fetch("https://dummyjson.com/productss");

        const data = await res.json();
        setProducts(data.products);
        setIsLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setIsLoading(false);
      }
    };
    fetchProducts();
    // When ever this component get render into the page, it could happen through several reason like: (navigating to next page & get back to the same page again) in that case 'useEffect' will get called and fetch api will fetch the list of product using http request on the server and again we are fetching the same product that we fetch before
    // Rather we should have a functionality to handle catching of the data that we fetch before and no need to do a request again to the server
  }, []);

  // Here we can see that It is becoming complex to hand just fetching data and rendering it into browser
  //

  return (
    <>
      {isLoading ? (
        <div className="bg-white w-full h-screen flex justify-center items-center">
          <h2>Loading... </h2>
        </div>
      ) : error ? (
        <div className="bg-white">
          <h2>Error: {error}</h2>
        </div>
      ) : (
        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Customers also purchased
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {products.map((product) => (
                <div key={product.id} className="group relative">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700">
                        <Link to={`/products/${product.id}`}>
                          <span
                            aria-hidden="true"
                            className="absolute inset-0"
                          />
                          {product.title}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {product.category}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* 
  *) React Query:
    -> React Query have 3 core concepts:
      1. Queries
        -> fetching data using get request
      2. Mutations
        -> if you want to update or post the data onto the server in that case we use mutation
      3. Query Invalidation
*/

export default ProductV1;
