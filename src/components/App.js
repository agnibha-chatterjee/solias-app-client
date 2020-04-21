import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './Dashboard';

function App() {
    return (
        <>
            <Router>
                <Switch>
                    <Route exact path='/' component={Dashboard} />
                    <Route exact path='/subscriptions' component={Dashboard} />
                </Switch>
            </Router>
        </>
    );
}

export default App;
