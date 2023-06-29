export class App {
    constructor(private readonly context: Modding.ModContext) {}

    public init() {
        const that = this;

        (<any>ShopBuyQuantityMenu) = new Proxy(ShopBuyQuantityMenu, {
            construct(target, args) {
                const construct = new target(args[0], args[1]);
                const index = target.menuCount - 1;

                // Timeout is needed for ui elements to be attached in the call stack.
                setTimeout(() => that.intercept(index));

                return construct;
            }
        });
    }

    private intercept(index: number) {
        const button = document.getElementById(`shop-buy-qty-btn-${index}`);
        const input = document.getElementById(`dropdown-content-custom-amount-${index}`);

        if (button && input) {
            // Prevent the browser from re-loading.
            input.parentElement.setAttribute('onsubmit', 'return false');

            // If pressing enter, just close the dropdown.
            input.addEventListener('keypress', event => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    button.click();
                }
            });
        }
    }
}
