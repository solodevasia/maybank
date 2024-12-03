import { RootState } from '@maybank/store';
import {
  addTable,
  role,
  searchTable,
  sortTable,
} from '@maybank/store/features/table-slice';
import { getProfile } from '@maybank/store/features/user-slice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function Dashboard() {
  const selector = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [pagination, setPagination] = useState(1);
  const [first, setFirst] = useState(0);
  const [last, setLast] = useState(4);
  const [sort, setSort] = useState({
    name: 'asc',
    email: 'asc',
    pic: 'asc',
    role: 'asc',
    is_active: 'asc',
  });
  const [state, setState] = useState({});
  const [isEdit, setIsEdit] = useState<number | null>(null);

  function fetchCurrentUser() {
    fetch('/api/user/profile', { method: 'GET' }).then(async (res) => {
      const data = await res.json();
      dispatch(getProfile(data.result));
    });
  }

  function fetchUserList(page = 1, limit = 10) {
    fetch(`/api/user/list?page=${page}&limit=${limit}`, { method: 'GET' }).then(
      async (res) => {
        const data = await res.json();
        dispatch(addTable(data));
        setPagination(() => page);
        if (page % 4 === 0) {
          if (data.pageSize !== first + 4) {
            setFirst(() => first + 4);
            setLast(() => last + 4);
          }
        } else {
          setFirst(() => 0);
          setLast(() => 4);
        }
      }
    );
  }

  function onBlur(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }

  function onEdit(id: number) {
    if (id === isEdit) {
      fetch(`/api/user/updated?user=${id}`, {
        method: 'POST',
        body: JSON.stringify(state),
      }).then(async () => {
        await fetchUserList(pagination);
      });
    }
    setIsEdit(() => (isEdit !== id ? id : null));
  }

  function onSearch(event: React.ChangeEvent<HTMLInputElement>) {
    dispatch(searchTable(event.target.value));
  }

  function onDestoryUser(id: number) {
    fetch(`/api/user/destroy?user=${id}`, { method: 'DELETE' }).then(
      async () => {
        await fetchUserList(pagination);
      }
    );
  }

  function onDropdownProfile() {
    setShow(() => !show);
  }

  function onLogout() {
    fetch('/api/logout').then(async () => {
      window.location.reload();
    });
  }

  useEffect(() => {
    fetchCurrentUser();
    fetchUserList();
  }, []);

  return (
    <div>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <a href="https://flowbite.com" className="flex ms-2 md:me-24">
                <img
                  src="https://i.pinimg.com/originals/1f/0d/20/1f0d20b1449fbd40709b98e29c12b92c.png"
                  className="h-8 me-3"
                  alt="FlowBite Logo"
                />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  Maybank
                </span>
              </a>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3">
                <div>
                  <button
                    type="button"
                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    aria-expanded="false"
                    data-dropdown-toggle="dropdown-user"
                    onClick={onDropdownProfile}
                  >
                    <img
                      className="w-8 h-8 rounded-full"
                      src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                      alt="user photo"
                    />
                  </button>
                </div>
                <div
                  className={`z-50 absolute top-10 right-0 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600 ${show ? '' : 'hidden'}`}
                  id="dropdown-user"
                >
                  <div className="px-4 py-3" role="none">
                    <p
                      className="text-sm text-gray-900 dark:text-white"
                      role="none"
                    >
                      {selector.user.name}
                    </p>
                    <p
                      className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                      role="none"
                    >
                      {selector.user.email}
                    </p>
                  </div>
                  <ul className="py-1" role="none">
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem"
                        onClick={onLogout}
                      >
                        Sign out
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>

      <div className="p-4 sm:ml-64">
        <div className="p-4 mt-14 bg-gray-800">
          <div className="mb-6 w-96">
            <label
              htmlFor="default-input"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Search
            </label>
            <input
              type="text"
              id="default-input"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search ..."
              onChange={onSearch}
            />
          </div>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3"
                    onClick={() => {
                      dispatch(sortTable({ name: 'name', type: sort.name }));
                      setSort((prevState) => ({
                        ...prevState,
                        name: sort.name === 'asc' ? 'desc' : 'asc',
                      }));
                    }}
                  >
                    Name
                    <a href="#">
                      <svg
                        className="w-3 h-3 ms-1.5 inline-flex"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </a>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3"
                    onClick={() => {
                      dispatch(sortTable({ name: 'email', type: sort.email }));
                      setSort((prevState) => ({
                        ...prevState,
                        email: sort.email === 'asc' ? 'desc' : 'asc',
                      }));
                    }}
                  >
                    Email
                    <a href="#">
                      <svg
                        className="w-3 h-3 ms-1.5 inline-flex"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </a>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3"
                    onClick={() => {
                      dispatch(sortTable({ name: 'pic', type: sort.pic }));
                      setSort((prevState) => ({
                        ...prevState,
                        pic: sort.pic === 'asc' ? 'desc' : 'asc',
                      }));
                    }}
                  >
                    PIC
                    <a href="#">
                      <svg
                        className="w-3 h-3 ms-1.5 inline-flex"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </a>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3"
                    onClick={() => {
                      dispatch(sortTable({ name: 'role', type: sort.role }));
                      setSort((prevState) => ({
                        ...prevState,
                        role: sort.role === 'asc' ? 'desc' : 'asc',
                      }));
                    }}
                  >
                    Role
                    <a href="#">
                      <svg
                        className="w-3 h-3 ms-1.5 inline-flex"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </a>
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 ${isEdit ? 'flex items-center w-40 mt-1' : ''}`}
                    onClick={() => {
                      dispatch(
                        sortTable({ name: 'is_active', type: sort.is_active })
                      );
                      setSort((prevState) => ({
                        ...prevState,
                        is_active: sort.is_active === 'asc' ? 'desc' : 'asc',
                      }));
                    }}
                  >
                    Is Active
                    <a href="#">
                      <svg
                        className="w-3 h-3 ms-1.5 inline-flex"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </a>
                  </th>
                  {selector.user.role === 1 ? (
                    <th scope="col" className="px-6 py-3">
                      Action
                      <a href="#">
                        <svg
                          className="w-3 h-3 ms-1.5 inline-flex"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                        </svg>
                      </a>
                    </th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {(selector.table.archive?.length
                  ? selector.table.archive
                  : selector.table.result
                )?.map((item, key) => (
                  <tr
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    key={key}
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {isEdit === item.id ? (
                        <div className="w-40">
                          <input
                            type="text"
                            id="default-input"
                            name="name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search ..."
                            defaultValue={item.name}
                            onBlur={onBlur}
                          />
                        </div>
                      ) : (
                        item.name
                      )}
                    </th>
                    <td className="px-6 py-4">
                      {isEdit === item.id ? (
                        <div className="w-40">
                          <input
                            type="text"
                            id="default-input"
                            name="email"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search ..."
                            defaultValue={item.email}
                            onBlur={onBlur}
                          />
                        </div>
                      ) : (
                        item.email
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEdit === item.id ? (
                        <div className="w-40">
                          <input
                            type="text"
                            id="default-input"
                            name="pic"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search ..."
                            defaultValue={item.pic}
                            onBlur={onBlur}
                          />
                        </div>
                      ) : (
                        item.pic
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEdit === item.id ? (
                        <select
                          defaultValue={item.role}
                          onBlur={onBlur}
                          name="role"
                          id="countries"
                          className="bg-gray-50 w-32 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-40"
                        >
                          <option selected>Choose a role</option>
                          <option value="1">Admin</option>
                          <option value="2">User</option>
                        </select>
                      ) : (
                        role[item.role as unknown as number]
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {item.is_active ? (
                        <div className="flex items-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>{' '}
                          Online
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-red-500 me-2"></div>{' '}
                          Offline
                        </div>
                      )}
                    </td>
                    {selector.user.role === 1 ? (
                      <td className="flex items-center px-6 py-4 w-48">
                        <a
                          href="#"
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                          onClick={() => onEdit(item.id)}
                        >
                          {isEdit === item.id ? 'Save' : 'Edit'}
                        </a>
                        <a
                          href="#"
                          className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
                          onClick={() => onDestoryUser(item.id)}
                        >
                          Remove
                        </a>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
            <nav
              className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
              aria-label="Table navigation"
            >
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
                Showing
                <span className="font-semibold text-gray-900 dark:text-white mx-1">
                  1-10
                </span>
                of
                <span className="font-semibold text-gray-900 dark:text-white ml-1">
                  {selector.table.count}
                </span>
              </span>
              <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                <li>
                  <a
                    href="#"
                    className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${selector.table?.previousUrl ? '' : 'cursor-no-drop'}`}
                    onClick={() =>
                      selector.table.previousUrl
                        ? fetchUserList(
                            Number(selector.table.previousUrl.split('page=')[1])
                          )
                        : null
                    }
                  >
                    Previous
                  </a>
                </li>
                {Array(selector.table.pageSize)
                  .slice(first, last)
                  .keys()
                  ?.map((item, key) => {
                    const num = item + 1;
                    return (
                      <div key={key}>
                        {num === pagination ? (
                          <li>
                            <a
                              href="#"
                              aria-current="page"
                              className="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                              onClick={() => fetchUserList(num)}
                            >
                              {num}
                            </a>
                          </li>
                        ) : (
                          <li>
                            <a
                              href="#"
                              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                              onClick={() => fetchUserList(num)}
                            >
                              {num}
                            </a>
                          </li>
                        )}
                      </div>
                    );
                  })}
                <li>
                  <a
                    href="#"
                    className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${selector.table.nextUrl ? '' : 'cursor-no-drop'}`}
                    onClick={() =>
                      selector.table.nextUrl
                        ? fetchUserList(
                            Number(selector.table.nextUrl.split('page=')[1])
                          )
                        : null
                    }
                  >
                    Next
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
