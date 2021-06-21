import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { AppState } from './store'
import Base from './views/Base'
import Login from './views/Login'

function App() {
	const token = useSelector((state: AppState) => state.user.token)
	return (
		<Router>
			<Switch>
				<Route path="/login" exact>
					<Login/>
				</Route>
				<Route path="">
					{
						token ? <Base/> : <Redirect to="/login" />
					}
				</Route>
			</Switch>
		</Router>
	);
}

export default App
