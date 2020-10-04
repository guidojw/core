const TEST_COOKIE = require("../getCookie");
const bloxy = require("../../dist");
const faker = require("faker");
const client = new bloxy.Client({
    credentials: {
        cookie: TEST_COOKIE
    }
});
const { wait } = require("../util");

beforeAll(async () => {
    return client.login(
        TEST_COOKIE
    )
        .then(clientUser => {
            console.log(`Using test account ${clientUser.id} with name ${clientUser.name}`);
        });
});

describe("testing TwoStepVerificationAPI", function () {
    const UNDER_MAINTENANCE_ERROR = {
        errors: [
            {
                code: 7,
                message: "Two step verification is currently under maintenance.",
                userFacingMessage: "Something went wrong"
            }
        ]
    };

    it("should retreive metadata", function () {
        return expect(
            client.apis.twpStepVerification.getMetaData({
                userId: client.user.id
            })
        )
            .toStrictEqual({
                twoStepVerificationEnabled: true,
                authenticatorEnabled: false,
                authenticatorQrCodeSize: "420x420",
                emailCodeLength: 6,
                authenticatorCodeLength: 6
            });
    });

    it("should retrieve user twostep configuration", function () {
        return expect(
            client.apis.twpStepVerification.getConfiguration({
                userId: client.user.id
            })
        )
            .toStrictEqual({
                primaryMediaType: null,
                methods: []
            });
    });

    it("should error when attepmting to verify, as it's not implemented yet", function () {
        expect(
            client.apis.twpStepVerification.verifyWithAuthenticator({
                challengeId: "a",
                actionType: "b",
                code: "c"
            })
        )
            .toStrictEqual(UNDER_MAINTENANCE_ERROR);
    });

    it("should error when attempting to disable, as it's WIP", function () {
        expect(
            client.apis.twpStepVerification.disableAuthenticator({
                password: ""
            })
        )
            .toStrictEqual(UNDER_MAINTENANCE_ERROR);
    });

    it("should error when attempting to enable, as it's WIP", function () {
        expect(
            client.apis.twpStepVerification.enableAuthenticator({
                userId: client.user.id
            })
        )
            .toStrictEqual(UNDER_MAINTENANCE_ERROR);
    });

    it("should error when attempting to verify and enable, as it's WIP", function () {
        expect(
            client.apis.twpStepVerification.verifyAuthenticatorSetup({
                code: "a",
                setupToken: "b"
            })
        )
            .toStrictEqual(UNDER_MAINTENANCE_ERROR);
    });
});
