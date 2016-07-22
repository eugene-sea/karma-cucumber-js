Feature: Test feature 1

Scenario: Test scenario 1.1
	Given there is a test step
	When it is executed
	Then test succeeds

Scenario: Test scenario 1.2
	Given there is a test step
	When it is executed
	Then test fails

@test
Scenario: Test scenario 1.3
	Given there is a test step
	When it is not executed
	Then test succeeds

Scenario: Test scenario 1.4
	Given there is an ambiguous test step
	When it is executed
	Then test fails
