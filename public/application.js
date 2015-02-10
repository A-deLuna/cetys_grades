var Alert = ReactBootstrap.Alert;
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;
var Table = ReactBootstrap.Table;


var style = {maxWidth: 400, margin: 'auto', padding: '15px'};
var tableStyle = {maxWidth: 600, margin: 'auto', padding: '10px'};

var App = React.createClass({
  getInitialState: function(){
    return {courses: [], showLogin: true};
  },
  render:function(){
    if(this.state.showLogin){
      return (
        <div style= {style}>
          <LoginForm onButtonClick={this.loadGrades}/>
          <GradesTable courses={this.state.courses}/>
        </div>
        
      );
    }
    else{
      return(
        <div style={tableStyle}>
          <GradesTable courses={this.state.courses}/>
        </div>
      );
    }
  },
  hideLogin: function(){
  },
  loadGrades: function(user){
    $.ajax({
      url: 'grades',
      dataType: 'json',
      type:'POST',
      data: user,
      success: function(data){
        this.setState({showLogin: false});
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
      <div >
        <form onSubmit = {this.handleSubmit}>
          <h2>Sign in with your m0xxxxx username and password</h2>
          <Input type="text" label='student_id'  ref='student'/>
          <Input type='password' label='Password' defualtValue="secret" ref='password'/>
          <Input type='submit' value = "Post" />
        </form>
      </div>
    );
  },
  handleSubmit: function(e){
    e.preventDefault();
    var user = this.refs.student.getInputDOMNode().value.trim();
    var password = this.refs.password.getInputDOMNode().value.trim();
    console.log (user + " " + password);
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
