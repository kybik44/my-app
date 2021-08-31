import React, { FormEvent, useEffect, useState } from "react";
import logo from "./img/logo.svg";
import search from "./img/search.svg";
import initialStateImage from "./img/big-search.svg";
import notfound from "./img/notfound.svg";
import "./App.css";
import { StatePage } from "./components/atoms/StatePage";
import { Header, UserCard, Pagination } from "./components/molecules";
import { createPages, getLastPage, getNewPage } from "./helpers/helpers";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { getRepos, getUser } from "./actions/repos";
import { setCurrentPage } from "./reducers/reposReducer";

function App() {
  const dispatch = useDispatch();

  const repos = useSelector((state: RootStateOrAny) => state.repos.items);
  const currentPage = useSelector(
    (state: RootStateOrAny) => state.repos.currentPage
  );
  const perPage = useSelector((state: RootStateOrAny) => state.repos.perPage);
  const totalCount = useSelector(
    (state: RootStateOrAny) => state.user.totalCount
  );
  const user = useSelector((state: RootStateOrAny) => state.user.user);
  const isFetching = useSelector(
    (state: RootStateOrAny) => state.repos.isFetching
  );

  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState(null);
  const [init, setInit] = useState(false);

  const pagesCount = getLastPage(totalCount, perPage);
  const pages: number[] = [];
  createPages(pages, pagesCount, currentPage);

  useEffect(() => {
    dispatch(getRepos(userInput, currentPage, perPage));
    dispatch(getUser(userInput));
  }, [currentPage]);

  const handleSearch = (e: FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setUserInput(target.value);
    if (!userInput.length) {
      setInit(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(setCurrentPage(1));
    dispatch(getRepos(userInput, currentPage, perPage));
    dispatch(getUser(userInput));
    setInit(true);
  };
  
  const indexOfLastItem = currentPage * perPage;
  const indexOfFirstItem = indexOfLastItem - perPage;
  // Change page
  const handlePaginate = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handleArrow = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const target = e.target as any;
    const field = target.closest("a").dataset.direction;
    const newPage = getNewPage(field, currentPage, pagesCount);
    dispatch(setCurrentPage(newPage));
  };

  return (
    <div className="App">
      <Header
        logo={logo}
        img={search}
        userInput={userInput}
        onSearch={handleSearch}
        onSubmit={handleSubmit}
      />
      {init ? (
        error ? (
          "das"
        ) : !error ? (
          <main>
            <UserCard
              data={user}
              repositories={repos}
              isFetching={isFetching}
            />
            {repos.length ? (
              <Pagination
                currentPage={currentPage}
                pages={pages}
                handlePaginate={handlePaginate}
                totalCount={totalCount}
                indexOfLastItem={indexOfLastItem}
                indexOfFirstItem={indexOfFirstItem}
                onClickArrow={handleArrow}
              />
            ) : (
              ""
            )}
          </main>
        ) : (
          <StatePage img={notfound} title="User not found" />
        )
      ) : (
        <StatePage
          img={initialStateImage}
          title="Start with searching a GitHub user"
        />
      )}
    </div>
  );
}

export default App;
