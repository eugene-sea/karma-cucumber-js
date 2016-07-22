Feature: Karma Cucumber.js Adapter
	Test features run in Karma are stored in test_features/ folder.

Scenario: Test several features in Karma
	Given I have several features with 9 passing steps, 2 pending and 1 failing
	And Karma is configured to test these features
	When I run Karma
	Then Karma reports the following steps counts:
		| Passed | Skipped | Failed |
		| 9      | 4       | 2      |

Scenario: Test features by tag in Karma
	Given I have several features with 9 passing steps, 2 pending and 1 failing
	And one passing scenario has "@test" tag
	And one pending scenario has "@test" tag
	And Karma is configured to test these features
	And Karma is configured to test scenarios of "@test" tag
	When I run Karma
	Then Karma reports the following steps counts:
		| Passed | Skipped | Failed |
		| 4      | 2       | 0      |
