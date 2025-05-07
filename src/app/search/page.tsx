import Search from "../components/Search";
import Navbar from "../components/Navbar";
const SearchPage = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center px-4 py-10">
        <h1 className="text-2xl font-bold mb-4">Seek and you will find...</h1>
        <Search />
      </div>
    </>
  );

};

export default SearchPage;
