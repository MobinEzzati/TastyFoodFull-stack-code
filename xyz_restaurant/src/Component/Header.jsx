import { useState } from 'react'
import { NavLink } from 'react-router-dom';
const data = [
	{
		title: 'All',
		link: '/',
	},
	{
		title: 'Ice Cream',
		link: '/Ice Cream',
	},
	{
		title: 'Meals',
		link: '/Meals',
	},
	{
		title: 'Fries',
		link: '/Fries',
	},

	{
		title: 'Burger',
		link: '/Burger',
	},

	{
		title: 'Coffee',
		link: '/Coffee',
	},

	{
		title: 'Chicken',
		link: '/Chiken',
	},

	{
		title: 'Happy Meal',
		link: '/Happy Meal',
	},
];
const Header = ({title}) => {
  const [navs] = useState(data);

  return (
    <>
      <div>
        <h1 className='h1'>{title}</h1>
      </div>
      <ul className='flex justify-center items-center gap-8'>
        {navs.map((nav, index) => (
          <li key={index} className='li'>
            <NavLink to={nav.link} className='navs'>
              {nav.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Header;