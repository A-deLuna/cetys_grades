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
      <a href="https://github.com/OneKorg/cetys_grades"><img style="position: absolute; top: 0; left: 0; border: 0;" src="calificacionescetys.me_files/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875.png" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_left_orange_ff7600.png"></a>

      <div class="panel" style="max-width: 400px; margin: 20px auto auto; background-color: rgb(250, 250, 210); box-shadow: 0px 0px 25px rgb(201, 167, 0); padding: 15px 15px 0px;">
        <form onSubmit = {this.handleSubmit}>
          <img src="img/LogoCetys.gif" alt="Logo Cetys" />
          <Input addonBefore = <Glyphicon glyph="user"/> type="text" defaultValue="m0XXXXX" ref='student'/>
          <Input addonBefore = <Glyphicon glyph="lock"/> type='password' defaultValue="********" ref='password'/>
          <Input type='checkbox' label = "Recordarme" />
          <Input type='submit' value = "Ingresar" bsStyle="warning"/>
        </form>
        <p style="text-align: center; font-style: italic; margin-bottom: 0px;">Por alumnos, para alumnos.</p>
      </div>
    );
  },
  handleSubmit: function(e){
    e.preventDefault();
    var user = this.refs.student.getInputDOMNode().value.trim();
    var password = this.refs.password.getInputDOMNode().value.trim();
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
