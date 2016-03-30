export class UserValidate {
    static isRequired(field) {
        field = field.toLowerCase();

        switch (field) {
            case 'name':
                return true;
            case 'email':
                return true;
            default:
                return false;
        }
    }

    static isUnique(value, values) {
        if (Array.isArray(values) && values.length > 0) {
            let unique = true;

            values.forEach(item => {
                if (value.toLowerCase() === item.toLowerCase()) {
                    unique = false;
                }
            });

            return unique;
        } else {
            return value !== values;
        }
    }
}