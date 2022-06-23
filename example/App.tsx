import React, { Component } from "react";
import { StyleSheet, Text, SafeAreaView,StatusBar } from "react-native";

export default class App extends Component {
	constructor(props: any) {
		super(props);
	}

	public render() {
		return (
			<SafeAreaView style={styles.container}>
				<StatusBar backgroundColor="blue" />
				<Text>
					111
				</Text>
			</SafeAreaView>
		);
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});
