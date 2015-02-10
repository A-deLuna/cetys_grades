var Alert = ReactBootstrap.Alert;
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;


var style = {maxWidth: 400, margin: 'auto'};

var App = React.createClass({
  getInitialState: function(){
    return {courses: []};
  },
  render:function(){
    return (
      <div>
        <LoginForm onButtonClick={this.loadGrades}/>
        <GradesTable courses={this.state.courses}/>
      </div>
    );
  },
  loadGrades: function(user){
    $.ajax({
      url: 'grades',
      dataType: 'json',
      type:'POST',
      data: user,
      success: function(data){
        this.setState({courses:data.courses});
      }.bind(this),
      error: function(xhr, status, err){
        console.error('grades',status, err.toString());
      }.bind(this)
    });
  }
});
var LoginForm = React.createClass({
  render: function(){
    return (
      <div style= {style}>
        <h2>Sign in with your m0xxxxx username and password</h2>
        <Input type="text" label='student_id' defaultValue='m0xxxxx' ref='student_id'/>
        <Input type='password' label='Password' defualtValue="secret" ref='password'/>
        <Button bsSize="large" bsStyle="primary" block onClick={this.handleSubmit}> Log In </Button>
      </div>
    );
  },
  handleSubmit: function(){
    var user = this.refs.student_id;
    var password = this.refs.student_id;
    this.props.onButtonClick({user: user, password:password});
  }

});
var GradesRow = React.createClass({
  render: function(){
    var tableGrades = this.props.grades.map(function( grade ){
      return (
        <td>{grade}</td>
      );
    });
    return (
      <tr>
        <td>{this.props.name}</td>
        {tableGrades}
      </tr>
    );
  }
});
var GradesTable = React.createClass({
  render: function(){
    var tableRows = this.props.courses.map(function(data){
      console.log(data);
      return (
        <GradesRow name={data.name} grades={data.grades}/>
      );
    });
    return (
      <div className="table">
      <Table responsive>
        <tbody>
          {tableRows}
        </tbody>
      </Table>
      </div>
    );
  }
});

React.render(
  <App />,
  document.getElementById("content") 
);
