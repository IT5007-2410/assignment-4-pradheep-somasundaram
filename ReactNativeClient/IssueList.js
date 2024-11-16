import React, { useState } from 'react';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-reanimated-table';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Button,
  useColorScheme,
  View,
  Alert,
} from 'react-native';


const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

async function graphQLFetch(query, variables = {}) {
  try {
    /****** Q4: Start Coding here. State the correct IP/port******/
    const response = await fetch('http://192.168.99.21:3000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ query, variables })
      /****** Q4: Code Ends here******/
    });
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);

    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code == 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }
    return result.data;
  } catch (e) {
    alert(`Error in sending data to server: ${e.message}`);
  }
}

class IssueFilter extends React.Component {
  render() {
    return (
      <>
        {/****** Q1: Start Coding here. ******/}
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'darkblue', backgroundColor: '#F5FCFF', textAlign: 'center', marginTop: 5 }}>
          Issue Filter Table
        </Text>
        {/****** Q1: Code ends here ******/}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  inputContainer: { padding: 16, paddingTop: 30, backgroundColor: '#F5FCFF', borderTopWidth: 1 },
  inputField: { marginBottom: 10, padding: 10, borderWidth: 0.5, backgroundColor: '#FFFFFF', borderRadius: 10, color: '#333' },
  header: { height: 50, backgroundColor: '#537791' },
  smallHeader: { height: 30, backgroundColor: '#537791' },
  smallHeaderText: { textAlign: 'center', color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  text: { textAlign: 'left', color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: '#E7E6E1' }
});

const width = [40, 80, 80, 80, 80, 80, 200];

function IssueRow(props) {
  const issue = props.issue;
  {/****** Q2: Coding Starts here. Create a row of data in a variable******/}
  const createdDate = issue["created"] != null ? issue["created"].toDateString() : ""
  const dueDate = issue["due"] != null ? issue["due"].toDateString() : ""

  const row = [issue["id"], issue["title"], issue["status"], issue["owner"], createdDate, issue["effort"], dueDate] //change to today using string
  {/****** Q2: Coding Ends here.******/}
  return (
    <>
      {/****** Q2: Start Coding here. Add Logic to render a row  ******/}
      <Row key={issue["id"]} data={row} style={styles.row} />
      {/****** Q2: Coding Ends here. ******/}
    </>
  );
}


function IssueTable(props) {
  const issueRows = props.issues.map(issue =>
    <IssueRow key={issue.id} issue={issue} />
  );

  {/****** Q2: Start Coding here. Add Logic to initalize table header  ******/}
  const header = ["ID", "TITLE", "STATUS", "OWNER", "CREATED", "EFFORT", "DUE"]
  {/****** Q2: Coding Ends here. ******/}


  return (
    <View style={styles.container}>
      <ScrollView>
        {/****** Q2: Start Coding here to render the table header/rows.**********/}
        <Table>
          <Row data={header} style={styles.smallHeader} textStyle={styles.smallHeaderText} />
          {issueRows}
        </Table>
      </ScrollView>
      {/****** Q2: Coding Ends here. ******/}
    </View>
  );
}


class IssueAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    /****** Q3: Start Coding here. Create State to hold inputs******/
    this.state = { owner: '', effort: '', title: '' };
    /****** Q3: Code Ends here. ******/
  }

  /****** Q3: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
  setOwner(newOwner) {
    this.setState({ owner: newOwner });
  }
  setEffort(newEffort) {
    this.setState({ effort: newEffort });
  }
  setTitle(newTitle) {
    this.setState({ title: newTitle });
  }
  /****** Q3: Code Ends here. ******/

  handleSubmit() {
    /****** Q3: Start Coding here. Create an issue from state variables and call createIssue. Also, clear input field in front-end******/
    const newIssue = { "owner": this.state.owner.trim(), "effort": this.state.effort.trim(), "title": this.state.title.trim(), due: "" }
    /****** Q3: Code Ends here. ******/

    //validation
    if (newIssue.owner.length == 0) {
      Alert.alert("Owner field cannot be empty")
      return;
    }

    if (newIssue.title.length == 0) {
      Alert.alert("Title field cannot be empty")
      return;
    }

    if (newIssue.effort.length == 0) {
      Alert.alert("Effort field cannot be empty")
      return;
    }

    if (isNaN(Number(newIssue.effort))) {
      Alert.alert("Effort field is expected to be a numeric field")
      return;
    }

    //set due date
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + Number(newIssue.effort))
    newIssue.due = dueDate.toISOString()

    //submit issue
    this.props.createIssue(newIssue)

    //reset field
    this.setEffort("")
    this.setOwner("")
    this.setTitle("")
  }

  render() {
    return (

      <View style={styles.inputContainer}>
        {/****** Q3: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'darkblue', textAlign: 'center', marginBottom: 10 }}>
          Adding new issue
        </Text>

        <Text style={[styles.text, { color: 'black' }]}>Owner's Name</Text>
        <TextInput style={styles.inputField} placeholder='owner' onChangeText={newOwner => this.setOwner(newOwner)} value={this.state.owner} />

        <Text style={[styles.text, { color: 'black' }]}>Effort In Days</Text>
        <TextInput style={styles.inputField} keyboardType='numeric' placeholder='effort' onChangeText={newEffort => this.setEffort(newEffort)} value={this.state.effort} />

        <Text style={[styles.text, { color: 'black' }]}>Issue Title</Text>
        <TextInput style={styles.inputField} placeholder='title' onChangeText={newTitle => this.setTitle(newTitle)} value={this.state.title} />

        <Button onPress={this.handleSubmit} title='Add a new issue' />
        {/****** Q3: Code Ends here. ******/}
      </View>
    );
  }
}

class BlackList extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    /****** Q4: Start Coding here. Create State to hold inputs******/
    this.state = { name: '' };
    /****** Q4: Code Ends here. ******/
  }

  /****** Q4: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
  setName(newname) {
    this.setState({ name: newname });
  }
  /****** Q4: Code Ends here. ******/

  async handleSubmit() {
    /****** Q4: Start Coding here. Create an issue from state variables and issue a query. Also, clear input field in front-end******/
    const query = `mutation mymutationtoaddtoBlacklist ($newnameforinput: String!){
      addToBlacklist(nameInput: $newnameforinput)
    }`;
    const newnameforinput = this.state.name;
    const data = await graphQLFetch(query, { newnameforinput });
    this.setState({ name: '' });
    /****** Q4: Code Ends here. ******/
  }

  render() {
    return (
      <View style={styles.inputContainer}>
        {/****** Q4: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'darkblue', textAlign: 'center', marginBottom: 10 }}>
          Blacklist user
        </Text>

        <Text style={[styles.text, { color: 'black' }]}>User name</Text>
        <TextInput style={styles.inputField} placeholder='Blacklist By User Name' on onChangeText={newname => { this.setName(newname) }} value={this.state.name} />
        <Button onPress={this.handleSubmit} title='Add to Blacklist' />
        {/****** Q4: Code Ends here. ******/}
      </View>
    );
  }
}

export default class IssueList extends React.Component {
  constructor() {
    super();
    this.state = { issues: [] };
    this.createIssue = this.createIssue.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
        issueList {
        id title status owner
        created effort due
        }
    }`;

    const data = await graphQLFetch(query);
    if (data) {
      this.setState({ issues: data.issueList });
    }
  }

  async createIssue(issue) {
    const query = `mutation issueAdd($issue: IssueInputs!) {
        issueAdd(issue: $issue) {
        id
        }
    }`;

    const data = await graphQLFetch(query, { issue });
    if (data) {
      this.loadData();
    }
  }


  render() {
    return (
      <>
        {/****** Q1: Start Coding here. ******/}
        <IssueFilter />
        {/****** Q1: Code ends here ******/}


        {/****** Q2: Start Coding here. ******/}
        <IssueTable issues={this.state.issues}></IssueTable>
        {/****** Q2: Code ends here ******/}


        {/****** Q3: Start Coding here. ******/}
        <IssueAdd createIssue={this.createIssue} />
        {/****** Q3: Code Ends here. ******/}

        {/****** Q4: Start Coding here. ******/}
        <BlackList />
        {/****** Q4: Code Ends here. ******/}
      </>

    );
  }
}
