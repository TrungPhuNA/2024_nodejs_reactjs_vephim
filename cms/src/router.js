import { CategoryForm } from "./components/Category/CategoryForm";
import { ContactPage } from "./components/Contact/Contact";
import { DiscountForm } from "./components/Discount/DiscountForm";
import { OrderForm } from "./components/Order/OrderForm";
import { ProductForm } from "./components/Products/ProductForm";
import { Permissions } from "./components/Settings/Permission/Permissions";
import { RoleForm } from "./components/Settings/Role/RoleForm";
import { Roles } from "./components/Settings/Role/Roles";
import { SlideForm } from "./components/Slide/SlideForm";
import { UserForm } from "./components/User/UserForm";
import {PageVoting} from "./components/vote/voteList";
import { CategoryContainer } from "./pages/category/CategoryContainer";
import Dashboard from "./pages/dashboard/Dashboard";
import { DiscountContainer } from "./pages/discount/DiscountContainer";
import ForbiddenPage from "./pages/error/403";
import { OrderContainer } from "./pages/order/OrderContainer";
import { ProductContainer } from "./pages/products/ProductContainer";
import { ProfileContainer } from "./pages/profile/ProfileContainer";
import { SlidesContainer } from "./pages/slides/SlidesContainer";
import { UserContainer } from "./pages/user/UserContainer";
import { BlogForm } from "./components/Blog/BlogForm";
import { BlogContainer } from "./pages/blog/BlogContainer";
import { MenuForm } from "./components/Menu/MenuForm";
import { MenuContainer } from "./pages/menu/MenuContainer";

export const ROUTERS = [
	{
		path: '/dashboard',
		exact: true,
		title: 'Dashboard',
		redirectFrom: '/', 
		component: Dashboard
	},
	{
		path: '/movie/list',
		exact: true,
		redirectFrom: '/movie', 
		title: 'List Movie',
		component: ProductContainer,
	},
	{
		path: '/movie/create',
		exact: true,
		title: 'Add new product',
		redirectFrom: null, 
		component: ProductForm,
	},
	{
		path: '/movie/edit/:id',
		exact: true,
		redirectFrom: null, 
		title: 'Edit product',
		component: ProductForm,
	},
	{
		path: '/user/list',
		exact: true,
		redirectFrom: '/user', 
		title: 'User',
		component: UserContainer,
	},
	{
		path: '/user/create',
		exact: true,
		redirectFrom: '/user', 
		title: 'Create',
		component: UserForm,
	},
	{
		path: '/user/edit/:id',
		exact: true,
		redirectFrom: '/user', 
		title: 'Edit',
		component: UserForm,
	},
	{
		path: '/category/list',
		exact: true,
		redirectFrom: '/category', 
		title: 'List',
		component: CategoryContainer,
	},
	{
		path: '/category/create',
		exact: true,
		redirectFrom: '/category', 
		title: 'Create',
		component: CategoryForm,
	},
	{
		path: '/category/edit/:id',
		exact: true,
		redirectFrom: '/category', 
		title: 'Edit',
		component: CategoryForm,
	},
	{
		path: '/room/list',
		exact: true,
		redirectFrom: '/room', 
		title: 'List',
		component: SlidesContainer,
	},
	{
		path: '/room/create',
		exact: true,
		redirectFrom: '/room', 
		title: 'Create',
		component: SlideForm,
	},
	{
		path: '/room/edit/:id',
		exact: true,
		redirectFrom: '/room', 
		title: 'Edit',
		component: SlideForm,
	},
	{
		path: '/order/list',
		exact: true,
		redirectFrom: '/order', 
		title: 'List',
		component: OrderContainer,
	},
	
	{
		path: '/order/view/:id',
		exact: true,
		redirectFrom: '/order', 
		title: 'Chi tiết',
		component: OrderForm,
	},
	{
		path: '/order/edit/:id',
		exact: true,
		redirectFrom: '/order', 
		title: 'Chỉnh sửa',
		component: OrderForm,
	},
	

	{
		path: '/profile',
		exact: true,
		// redirectFrom: '/role', 
		title: 'Profile',
		component: ProfileContainer,
	},

	{
		path: '/reviews',
		exact: true,
		// redirectFrom: '/role', 
		title: 'Reviews',
		component: PageVoting,
	},

	{
		path: '/contact',
		exact: true,
		// redirectFrom: '/role', 
		title: 'Contacts',
		component: ContactPage,
	},

	{
		path: '/schedule',
		exact: true,
		redirectFrom: '/schedule', 
		title: 'schedule',
		component: DiscountContainer,
	},
	{
		path: '/schedule/create',
		exact: true,
		redirectFrom: null, 
		title: 'Create schedule',
		component: DiscountForm,
	},
	{
		path: '/schedule/edit/:id',
		exact: true,
		redirectFrom: null, 
		title: 'Update schedule',
		component: DiscountForm,
	},
	{
		path: '/403',
		exact: true,
		redirectFrom: null, 
		title: 'Permission Denied',
		component: ForbiddenPage,
	},

	{
		path: '/menu/list',
		exact: true,
		redirectFrom: '/menu', 
		title: 'Menus',
		component: MenuContainer,
	},
	{
		path: '/menu/create',
		exact: true,
		redirectFrom: null, 
		title: 'Create Menu',
		component: MenuForm,
	},
	{
		path: '/menu/edit/:id',
		exact: true,
		redirectFrom: null, 
		title: 'Update Menu',
		component: MenuForm,
	},


	{
		path: '/blog/list',
		exact: true,
		redirectFrom: '/blog', 
		title: 'Menus',
		component: BlogContainer,
	},
	{
		path: '/blog/create',
		exact: true,
		redirectFrom: null, 
		title: 'Create Menu',
		component: BlogForm,
	},
	{
		path: '/blog/edit/:id',
		exact: true,
		redirectFrom: null, 
		title: 'Update Menu',
		component: BlogForm,
	},
]