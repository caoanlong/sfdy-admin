import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Base from './views/Base'
import Login from './views/Login'

function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/login">
					<Login/>
				</Route>
				<Route path="/">
					<Base/>
				</Route>
			</Switch>
		</BrowserRouter>
	);
}

export default App
